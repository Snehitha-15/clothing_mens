from collections import defaultdict, Counter
from datetime import timedelta
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
from django.db import models
from .models import SearchLog, Product, WishlistItem, OrderItem, ProductView

CACHE_PREFIX = "user_reco_v1:"   # bump version to invalidate
CACHE_TTL = 70  # seconds

def compute_recommendations_for_user(user, top_n=12):
    """
    Returns a list of product ids ordered by score.
    Simple heuristic:
      - wishlist category match: +5 per match
      - search term match (product name/description): +2 per match
      - product popularity (views + orders): +score
    """
    now = timezone.now()
    scores = defaultdict(float)

    # 1) Wishlist categories => high weight
    wishlist_categories = WishlistItem.objects.filter(user=user).select_related('product__category')
    wishlist_cat_counts = Counter([w.product.category_id for w in wishlist_categories])
    for cat_id, cnt in wishlist_cat_counts.items():
        # give weight for category; boost all products in that category
        products_in_cat = Product.objects.filter(category_id=cat_id, stock__gt=0).only('id')
        for p in products_in_cat:
            scores[p.id] += 5 * cnt

    # 2) Recent search terms (last 7 days) => medium weight
    search_logs = SearchLog.objects.filter(user=user, created_at__gte=now - timedelta(days=7)).order_by('-created_at')[:20]
    terms = []
    for s in search_logs:
        terms.extend(s.query.lower().split())
    term_counts = Counter(terms)
    if term_counts:
        # find products matching any term in name/description
        # simple contains search (you can replace with full-text)
        qs = Product.objects.filter(stock__gt=0)
        for term, tcount in term_counts.items():
            matched = qs.filter(models.Q(name__icontains=term) | models.Q(description__icontains=term)).only('id')
            for p in matched:
                scores[p.id] += 2 * tcount

    # 3) Popularity (last 30 days)
    thirty = now - timedelta(days=30)
    order_counts = (OrderItem.objects.filter(order__created_at__gte=thirty)
                                  .values('product')
                                  .annotate(cnt=models.Count('id')))
    for o in order_counts:
        scores[o['product']] += 0.5 * o['cnt']

    view_counts = (ProductView.objects.filter(created_at__gte=thirty)
                               .values('product')
                               .annotate(cnt=models.Count('id')))
    for v in view_counts:
        scores[v['product']] += 0.2 * v['cnt']

    # Remove items user already purchased or currently has in wishlist (optional)
    purchased = set(OrderItem.objects.filter(order__user=user).values_list('product_id', flat=True))
    wish_ids = set(WishlistItem.objects.filter(user=user).values_list('product_id', flat=True))

    # Build final sorted list
    # filter out stock<=0 + remove purchased maybe
    candidate_ids = [pid for pid, sc in scores.items()]
    candidates = Product.objects.filter(id__in=candidate_ids, stock__gt=0).only('id','name','price','image','category_id')
    final = []
    for p in candidates:
        pid = p.id
        if pid in purchased:
            continue
        final.append((pid, scores.get(pid, 0)))

    final.sort(key=lambda x: x[1], reverse=True)
    recommended_ids = [pid for pid, _ in final][:top_n]
    return recommended_ids

def cache_recommendations_for_user(user):
    key = CACHE_PREFIX + str(user.id)
    recs = compute_recommendations_for_user(user)
    cache.set(key, recs, CACHE_TTL)
    return recs

def get_cached_recommendations(user):
    key = CACHE_PREFIX + str(user.id)
    recs = cache.get(key)
    if recs is None:
        recs = cache_recommendations_for_user(user)
    return recs
