from collections import defaultdict, Counter
from datetime import timedelta
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
from django.db import models
from .models import SearchLog, Product, WishlistItem, OrderItem, ProductView

CACHE_PREFIX = "user_reco_v1:"   
CACHE_TTL = 70  # seconds


def compute_recommendations_for_user(user, top_n=12):

    now = timezone.now()
    scores = defaultdict(float)

    # 1️⃣ Wishlist categories — boost products from these categories
    wishlist_categories = WishlistItem.objects.filter(user=user).select_related("product__category")
    wishlist_cat_counts = Counter([w.product.category_id for w in wishlist_categories])

    for cat_id, cnt in wishlist_cat_counts.items():
        # FIXED: stock moved to variants
        products_in_cat = (
            Product.objects.filter(category_id=cat_id, variants__stock__gt=0)
            .distinct()
            .only("id")
        )
        for p in products_in_cat:
            scores[p.id] += 5 * cnt

    # 2️⃣ Recent search terms — match name/description
    search_logs = (
        SearchLog.objects.filter(user=user, created_at__gte=now - timedelta(days=7))
        .order_by("-created_at")[:20]
    )

    terms = []
    for s in search_logs:
        terms.extend(s.query.lower().split())

    term_counts = Counter(terms)

    if term_counts:
        qs = Product.objects.filter(variants__stock__gt=0).distinct()

        for term, tcount in term_counts.items():
            matched = qs.filter(
                models.Q(name__icontains=term) | models.Q(description__icontains=term)
            ).only("id")

            for p in matched:
                scores[p.id] += 2 * tcount

    # 3️⃣ Popularity Factors (Orders + Views)
    thirty = now - timedelta(days=30)

    # Order popularity
    order_counts = (
        OrderItem.objects.filter(order__created_at__gte=thirty)
        .values("product")
        .annotate(cnt=models.Count("id"))
    )
    for o in order_counts:
        scores[o["product"]] += 0.5 * o["cnt"]

    # Views popularity
    view_counts = (
        ProductView.objects.filter(created_at__gte=thirty)
        .values("product")
        .annotate(cnt=models.Count("id"))
    )
    for v in view_counts:
        scores[v["product"]] += 0.2 * v["cnt"]

    # Remove purchased or wishlisted products
    purchased = set(OrderItem.objects.filter(order__user=user).values_list("product_id", flat=True))
    wish_ids = set(WishlistItem.objects.filter(user=user).values_list("product_id", flat=True))

    # 4️⃣ Final filtering
    candidate_ids = [pid for pid in scores.keys()]

    # FIXED: product must have at least one variant with stock > 0
    candidates = (
        Product.objects.filter(id__in=candidate_ids, variants__stock__gt=0)
        .distinct()
        .only("id", "name", "price", "image", "category_id")
    )

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
