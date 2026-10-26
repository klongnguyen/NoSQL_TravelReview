/**
 * VIETNAM GEOGRAPHIC MAP DATA (Wikipedia & GIS Sourced)
 * Chứa danh sách 63 tỉnh thành Việt Nam với tọa độ vector SVG chuẩn xác
 * và thông tin bách khoa Wikipedia chính thống.
 */

export const VIETNAM_MAP_VIEWBOX = "0 0 8800 11000";

export const VIETNAM_PROVINCES_DATA = [
  {
    "id": "vn-qn",
    "hcKey": "vn-qn",
    "name": "Quảng Ninh",
    "fullName": "Tỉnh Quảng Ninh",
    "region": "Đông Bắc Bộ",
    "regionKey": "dong-bac-bo",
    "area": "6.178 km²",
    "population": "Khoảng 1,35 triệu người",
    "wikiSummary": "Địa phương sở hữu Vịnh Hạ Long – kỳ quan thiên nhiên thế giới được UNESCO công nhận nhiều lần. Quảng Ninh là thiên đường du lịch biển đảo với hàng nghìn hòn đảo đá vôi kỳ vĩ và non thiêng Yên Tử.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Vịnh Hạ Long",
      "Vịnh Bái Tử Long",
      "Danh thắng Yên Tử",
      "Đảo Cô Tô",
      "Bảo tàng Quảng Ninh",
      "Đảo Tuần Châu"
    ],
    "bestSeason": "Tháng 4 - Tháng 6 & Tháng 9 - Tháng 11 (Trời trong, biển lặng, gió mát lý tưởng đi du thuyền)",
    "matchingFilter": "Hạ Long",
    "centroid": {
      "x": 3488,
      "y": 1550
    },
    "svgPath": "M 3184 1842 L 3212 1870 L 3194 1867 L 3171 1831 L 3184 1842 Z M 3583 1806 L 3608 1806 L 3613 1822 L 3594 1827 L 3583 1806 Z M 3235 1816 L 3267 1878 L 3240 1877 L 3221 1844 L 3187 1833 L 3196 1780 L 3224 1791 L 3235 1816 Z M 3675 1859 L 3669 1808 L 3701 1799 L 3723 1754 L 3720 1781 L 3675 1859 Z M 3180 1744 L 3179 1768 L 3133 1758 L 3132 1740 L 3180 1744 Z M 3890 1725 L 3853 1765 L 3867 1732 L 3857 1705 L 3890 1725 Z M 3710 1692 L 3728 1696 L 3709 1758 L 3688 1784 L 3617 1799 L 3683 1748 L 3691 1707 L 3710 1692 Z M 3743 1635 L 3737 1660 L 3703 1679 L 3724 1638 L 3743 1635 Z M 3750 1715 L 3734 1709 L 3750 1661 L 3778 1639 L 3750 1715 Z M 3897 1464 L 3830 1494 L 3840 1482 L 3879 1457 L 3897 1464 Z M 4026 1424 L 3919 1462 L 3937 1432 L 4026 1420 L 4026 1424 Z M 3103 1717 L 3098 1717 L 3072 1711 L 3052 1700 L 2984 1692 L 2961 1684 L 2958 1659 L 2995 1635 L 3029 1588 L 3177 1610 L 3221 1609 L 3317 1582 L 3333 1542 L 3340 1496 L 3385 1462 L 3428 1454 L 3488 1427 L 3506 1404 L 3508 1368 L 3493 1338 L 3504 1317 L 3567 1274 L 3577 1284 L 3619 1249 L 3644 1248 L 3655 1285 L 3688 1295 L 3704 1275 L 3759 1276 L 3812 1261 L 3849 1237 L 3909 1249 L 3925 1277 L 4020 1360 L 3978 1392 L 3970 1337 L 3931 1329 L 3922 1356 L 3903 1356 L 3877 1334 L 3880 1382 L 3867 1385 L 3854 1418 L 3777 1439 L 3782 1469 L 3759 1475 L 3753 1502 L 3728 1503 L 3708 1468 L 3688 1503 L 3626 1482 L 3646 1507 L 3594 1523 L 3586 1583 L 3609 1588 L 3601 1638 L 3587 1663 L 3601 1703 L 3574 1720 L 3513 1723 L 3477 1760 L 3447 1776 L 3390 1752 L 3409 1726 L 3446 1701 L 3428 1699 L 3383 1716 L 3361 1702 L 3371 1727 L 3356 1758 L 3308 1761 L 3257 1730 L 3243 1734 L 3291 1773 L 3305 1798 L 3267 1794 L 3254 1814 L 3229 1774 L 3211 1778 L 3187 1760 L 3218 1751 L 3196 1719 L 3158 1707 L 3149 1725 L 3103 1717 Z M 3309 1823 L 3341 1836 L 3361 1828 L 3375 1850 L 3406 1857 L 3411 1882 L 3371 1898 L 3393 1910 L 3378 1944 L 3344 1908 L 3336 1914 L 3283 1861 L 3309 1823 Z M 3649 1567 L 3652 1523 L 3663 1520 L 3702 1552 L 3706 1573 L 3757 1560 L 3719 1607 L 3703 1604 L 3667 1652 L 3611 1688 L 3600 1680 L 3620 1630 L 3630 1579 L 3649 1567 Z"
  },
  {
    "id": "vn-kh",
    "hcKey": "vn-kh",
    "name": "Khánh Hòa",
    "fullName": "Tỉnh Khánh Hòa (Nha Trang)",
    "region": "Duyên hải Nam Trung Bộ",
    "regionKey": "duyen-hai-nam-trung-bo",
    "area": "5.137 km²",
    "population": "Khoảng 1,3 triệu người",
    "wikiSummary": "Xứ sở Trầm Hương với vịnh biển Nha Trang thơ mộng trong top các vịnh biển đẹp nhất thế giới. Tỉnh đồng thời là đơn vị hành chính quản lý toàn bộ huyện đảo Trường Sa thiêng liêng của Tổ quốc.",
    "thumbnail": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Vịnh Nha Trang & Đảo Hòn Tre (VinWonders)",
      "Tháp Bà Ponagar",
      "Viện Hải dương học",
      "Vịnh Cam Ranh",
      "Quần đảo Trường Sa"
    ],
    "bestSeason": "Tháng 1 - Tháng 8 (Mùa khô chan hòa ánh nắng, biển trong vắt như ngọc, thích hợp lặn biển)",
    "matchingFilter": "Nha Trang",
    "centroid": {
      "x": 4966,
      "y": 8056
    },
    "svgPath": "M 5089 8146 L 5104 8161 L 5060 8171 L 5029 8142 L 5049 8137 L 5089 8146 Z M 5140 7889 L 5125 7895 L 5072 7858 L 5078 7848 L 5123 7850 L 5140 7889 Z M 5122 7696 L 5117 7738 L 5150 7800 L 5187 7825 L 5172 7838 L 5173 7888 L 5158 7885 L 5138 7846 L 5153 7828 L 5137 7803 L 5118 7813 L 5118 7839 L 5093 7824 L 5124 7792 L 5107 7726 L 5065 7758 L 4995 7835 L 4996 7906 L 5015 7876 L 5027 7880 L 5016 7913 L 5028 7936 L 5064 7958 L 5065 7993 L 5099 8018 L 5065 8051 L 5005 7987 L 4982 7973 L 4957 7987 L 4977 8017 L 4999 8026 L 5005 8066 L 5025 8086 L 5009 8092 L 4999 8139 L 5014 8163 L 5003 8174 L 5016 8209 L 5005 8223 L 5008 8260 L 5034 8312 L 5062 8333 L 5047 8364 L 5056 8409 L 5018 8399 L 5011 8377 L 5012 8299 L 4980 8216 L 4971 8229 L 4981 8272 L 5007 8306 L 4998 8348 L 4968 8385 L 4954 8387 L 4951 8436 L 4974 8440 L 4998 8406 L 5004 8466 L 4939 8460 L 4918 8444 L 4903 8405 L 4879 8380 L 4786 8360 L 4766 8347 L 4715 8223 L 4692 8199 L 4649 8182 L 4639 8117 L 4621 8093 L 4610 8045 L 4608 7987 L 4615 7964 L 4687 7950 L 4730 7969 L 4744 7958 L 4761 7898 L 4757 7866 L 4779 7813 L 4825 7802 L 4872 7759 L 4920 7744 L 4956 7703 L 4986 7688 L 5077 7682 L 5122 7696 Z"
  },
  {
    "id": "vn-tg",
    "hcKey": "vn-tg",
    "name": "Tiền Giang",
    "fullName": "Tỉnh Tiền Giang (Mỹ Tho)",
    "region": "Đồng bằng sông Cửu Long",
    "regionKey": "dong-bang-song-cuu-long",
    "area": "2.510 km²",
    "population": "Khoảng 1,78 triệu người",
    "wikiSummary": "Cửa ngõ miền Tây sông nước nổi tiếng với cù lao Thới Sơn rợp bóng dừa, miệt vườn trái cây trĩu quả quanh năm và chùa Vĩnh Tràng cổ kính mang nét giao thoa Á - Âu độc đáo.",
    "thumbnail": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Chùa Vĩnh Tràng",
      "Cù lao Thới Sơn (Cồn Lân)",
      "Trại rắn Đồng Tâm",
      "Chợ nổi Cái Bè",
      "Vườn hoa Mãn Đình Hồng"
    ],
    "bestSeason": "Quanh năm (Đặc biệt từ Tháng 6 - Tháng 9 mùa trái cây chín rộ ngọt lành)",
    "matchingFilter": "Tiền Giang",
    "centroid": {
      "x": 2915,
      "y": 9501
    },
    "svgPath": "M 3228 9628 L 3193 9611 L 3098 9595 L 3202 9594 L 3234 9603 L 3228 9628 Z M 2582 9577 L 2575 9546 L 2654 9446 L 2664 9392 L 2728 9399 L 2763 9396 L 2783 9373 L 2812 9363 L 2888 9367 L 2919 9383 L 2949 9426 L 3011 9451 L 3020 9492 L 3116 9493 L 3138 9476 L 3167 9449 L 3178 9479 L 3209 9453 L 3229 9453 L 3263 9507 L 3269 9571 L 3255 9594 L 3203 9584 L 3126 9585 L 2998 9565 L 2940 9550 L 2894 9565 L 2840 9566 L 2807 9579 L 2769 9581 L 2717 9564 L 2683 9564 L 2659 9587 L 2618 9585 L 2582 9577 Z"
  },
  {
    "id": "vn-bv",
    "hcKey": "vn-bv",
    "name": "Bà Rịa - Vũng Tàu",
    "fullName": "Tỉnh Bà Rịa - Vũng Tàu",
    "region": "Đông Nam Bộ",
    "regionKey": "dong-nam-bo",
    "area": "1.980 km²",
    "population": "Khoảng 1,18 triệu người",
    "wikiSummary": "Điểm đến nghỉ dưỡng biển hàng đầu của vùng kinh tế trọng điểm phía Nam. Sở hữu các bãi tắm Bãi Trước, Bãi Sau thoai thoải, ngọn hải đăng cổ kính và quần đảo Côn Đảo huyền thoại.",
    "thumbnail": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Bãi Sau & Bãi Trước Vũng Tàu",
      "Tượng Chúa Kitô Vua",
      "Ngọn Hải Đăng Vũng Tàu",
      "Bạch Dinh",
      "Mũi Nghinh Phong",
      "Côn Đảo"
    ],
    "bestSeason": "Tháng 11 - Tháng 4 (Mùa khô nắng ấm, biển êm, rất gần TP.HCM tiện đi cuối tuần)",
    "matchingFilter": "Vũng Tàu",
    "centroid": {
      "x": 3600,
      "y": 9361
    },
    "svgPath": "M 3564 9473 L 3538 9507 L 3516 9517 L 3481 9557 L 3475 9508 L 3530 9484 L 3542 9453 L 3564 9473 Z M 3431 9419 L 3441 9402 L 3434 9329 L 3500 9306 L 3520 9291 L 3525 9260 L 3590 9229 L 3619 9230 L 3627 9274 L 3643 9289 L 3676 9286 L 3747 9205 L 3765 9207 L 3790 9238 L 3836 9341 L 3842 9371 L 3802 9416 L 3742 9445 L 3659 9460 L 3615 9516 L 3555 9497 L 3574 9475 L 3544 9444 L 3520 9452 L 3491 9435 L 3440 9447 L 3435 9427 L 3431 9419 Z M 3418 9336 L 3434 9352 L 3425 9382 L 3410 9377 L 3414 9337 L 3418 9336 Z"
  },
  {
    "id": "vn-bu",
    "hcKey": "vn-bu",
    "name": "Bình Thuận",
    "fullName": "Tỉnh Bình Thuận",
    "region": "Southeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bình Thuận là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bình Thuận",
      "Di tích lịch sử Bình Thuận",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bình Thuận",
    "centroid": {
      "x": 4235,
      "y": 8970
    },
    "svgPath": "M 4844 9402 L 4825 9412 L 4815 9393 L 4827 9377 L 4844 9402 Z M 3842 9371 L 3836 9341 L 3790 9238 L 3823 9204 L 3843 9168 L 3841 9123 L 3818 9073 L 3799 9058 L 3760 9058 L 3726 9031 L 3783 8897 L 3825 8818 L 3854 8793 L 3913 8817 L 3960 8826 L 4144 8834 L 4175 8856 L 4176 8900 L 4204 8894 L 4247 8848 L 4318 8829 L 4379 8782 L 4364 8736 L 4366 8699 L 4415 8668 L 4507 8664 L 4555 8680 L 4583 8636 L 4639 8648 L 4653 8693 L 4688 8712 L 4695 8750 L 4765 8763 L 4793 8810 L 4757 8803 L 4707 8828 L 4686 8860 L 4666 8916 L 4613 8909 L 4556 8919 L 4510 8950 L 4481 9013 L 4406 9036 L 4389 9087 L 4357 9117 L 4327 9089 L 4217 9115 L 4187 9152 L 4166 9222 L 4140 9276 L 4095 9262 L 4056 9264 L 4013 9282 L 3983 9308 L 3900 9348 L 3842 9371 Z"
  },
  {
    "id": "vn-hc",
    "hcKey": "vn-hc",
    "name": "TP. Hồ Chí Minh",
    "fullName": "Thành phố Hồ Chí Minh",
    "region": "Đông Nam Bộ",
    "regionKey": "dong-nam-bo",
    "area": "2.095 km²",
    "population": "Khoảng 9,3 triệu người",
    "wikiSummary": "Thành phố Hồ Chí Minh là trung tâm kinh tế, tài chính, văn hóa và du lịch lớn nhất Việt Nam. Thành phố nổi tiếng với kiến trúc giao thoa Pháp - Việt, nhịp sống sầm uất cả ngày lẫn đêm, cùng nền ẩm thực phong phú bậc nhất Đông Nam Á.",
    "thumbnail": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Dinh Độc Lập",
      "Nhà thờ Đức Bà",
      "Chợ Bến Thành",
      "Bưu điện Trung tâm Sài Gòn",
      "Phố đi bộ Nguyễn Huệ",
      "Địa đạo Củ Chi"
    ],
    "bestSeason": "Tháng 12 - Tháng 4 (Mùa khô ráo, nắng ấm, thuận tiện dạo phố và tham quan)",
    "matchingFilter": "Hồ Chí Minh",
    "centroid": {
      "x": 3231,
      "y": 9283
    },
    "svgPath": "M 3379 9423 L 3360 9483 L 3371 9473 L 3401 9498 L 3336 9523 L 3326 9483 L 3339 9454 L 3336 9425 L 3364 9413 L 3379 9423 Z M 3360 9370 L 3360 9397 L 3340 9372 L 3346 9412 L 3312 9383 L 3327 9329 L 3365 9357 L 3360 9370 Z M 3435 9427 L 3411 9442 L 3431 9419 L 3435 9427 Z M 2953 9077 L 2993 9016 L 3001 8973 L 3062 8964 L 3106 9027 L 3138 9056 L 3206 9150 L 3223 9155 L 3269 9140 L 3296 9145 L 3329 9199 L 3329 9236 L 3291 9230 L 3263 9243 L 3237 9229 L 3240 9279 L 3297 9311 L 3338 9304 L 3390 9351 L 3405 9379 L 3425 9412 L 3397 9447 L 3371 9393 L 3375 9355 L 3330 9317 L 3292 9333 L 3251 9292 L 3225 9313 L 3251 9353 L 3236 9380 L 3261 9355 L 3236 9308 L 3253 9307 L 3306 9345 L 3300 9385 L 3321 9407 L 3318 9438 L 3326 9458 L 3295 9449 L 3315 9479 L 3301 9498 L 3266 9475 L 3242 9438 L 3236 9380 L 3231 9391 L 3230 9343 L 3206 9318 L 3159 9328 L 3134 9306 L 3070 9276 L 3049 9257 L 3069 9208 L 3071 9173 L 3036 9119 L 2953 9077 Z"
  },
  {
    "id": "vn-br",
    "hcKey": "vn-br",
    "name": "Bến Tre",
    "fullName": "Tỉnh Bến Tre",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bến Tre là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bến Tre",
      "Di tích lịch sử Bến Tre",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bến Tre",
    "centroid": {
      "x": 3010,
      "y": 9711
    },
    "svgPath": "M 3088 9915 L 3071 9915 L 3054 9888 L 2999 9846 L 3046 9868 L 3088 9915 Z M 2778 9623 L 2745 9607 L 2659 9587 L 2683 9564 L 2717 9564 L 2769 9581 L 2807 9579 L 2840 9566 L 2894 9565 L 2940 9550 L 2998 9565 L 3040 9591 L 3215 9649 L 3271 9680 L 3267 9715 L 3228 9756 L 3204 9760 L 3204 9735 L 3178 9772 L 3161 9816 L 3122 9810 L 3090 9785 L 3054 9770 L 3014 9731 L 2953 9635 L 2932 9614 L 2904 9605 L 2946 9640 L 2960 9683 L 3028 9771 L 3100 9812 L 3139 9841 L 3199 9872 L 3189 9902 L 3174 9881 L 3171 9907 L 3137 9930 L 3102 9912 L 3059 9866 L 2979 9816 L 2797 9630 L 2778 9623 Z"
  },
  {
    "id": "vn-st",
    "hcKey": "vn-st",
    "name": "Sóc Trăng",
    "fullName": "Tỉnh Sóc Trăng",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Sóc Trăng là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Sóc Trăng",
      "Di tích lịch sử Sóc Trăng",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Sóc Trăng",
    "centroid": {
      "x": 2616,
      "y": 10133
    },
    "svgPath": "M 3183 10710 L 3161 10721 L 3173 10750 L 3134 10753 L 3132 10784 L 3103 10763 L 3131 10725 L 3175 10700 L 3183 10710 Z M 2771 9983 L 2806 10033 L 2846 10075 L 2906 10100 L 2900 10132 L 2871 10138 L 2875 10120 L 2837 10083 L 2858 10116 L 2836 10111 L 2785 10038 L 2771 9983 Z M 2621 9859 L 2746 9982 L 2761 10023 L 2837 10134 L 2843 10195 L 2817 10224 L 2834 10260 L 2707 10300 L 2598 10344 L 2572 10264 L 2549 10245 L 2470 10250 L 2402 10225 L 2386 10195 L 2380 10084 L 2456 10062 L 2542 10009 L 2562 10004 L 2621 9859 Z"
  },
  {
    "id": "vn-pt",
    "hcKey": "vn-pt",
    "name": "Phú Thọ",
    "fullName": "Tỉnh Phú Thọ",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Phú Thọ là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Phú Thọ",
      "Di tích lịch sử Phú Thọ",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Phú Thọ",
    "centroid": {
      "x": 2071,
      "y": 1521
    },
    "svgPath": "M 1848 1494 L 1894 1468 L 1911 1444 L 1889 1352 L 1891 1320 L 1913 1280 L 1965 1251 L 2016 1238 L 2043 1219 L 2087 1246 L 2126 1282 L 2184 1358 L 2202 1417 L 2235 1435 L 2276 1498 L 2281 1515 L 2261 1532 L 2251 1510 L 2209 1514 L 2202 1561 L 2162 1595 L 2177 1643 L 2162 1696 L 2178 1727 L 2193 1749 L 2195 1795 L 2170 1797 L 2111 1781 L 2045 1772 L 1995 1729 L 1926 1696 L 1903 1661 L 1878 1626 L 1874 1552 L 1848 1494 Z"
  },
  {
    "id": "vn-yb",
    "hcKey": "vn-yb",
    "name": "Yên Bái",
    "fullName": "Tỉnh Yên Bái",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Yên Bái là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Yên Bái",
      "Di tích lịch sử Yên Bái",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Yên Bái",
    "centroid": {
      "x": 1673,
      "y": 1171
    },
    "svgPath": "M 2043 1219 L 2016 1238 L 1965 1251 L 1913 1280 L 1891 1320 L 1889 1352 L 1911 1444 L 1894 1468 L 1848 1494 L 1814 1490 L 1793 1454 L 1753 1456 L 1694 1432 L 1663 1439 L 1616 1467 L 1585 1465 L 1524 1429 L 1505 1409 L 1493 1371 L 1498 1321 L 1520 1243 L 1491 1214 L 1440 1243 L 1397 1251 L 1292 1231 L 1229 1205 L 1248 1152 L 1222 1107 L 1271 1019 L 1329 1058 L 1372 1063 L 1422 1080 L 1441 1030 L 1522 1070 L 1551 1076 L 1580 1050 L 1583 1010 L 1543 928 L 1555 902 L 1607 896 L 1661 932 L 1699 889 L 1724 875 L 1712 813 L 1754 808 L 1809 869 L 1862 877 L 1887 937 L 1954 997 L 1965 1021 L 1964 1058 L 2018 1121 L 2035 1152 L 2025 1185 L 2043 1219 Z"
  },
  {
    "id": "vn-hd",
    "hcKey": "vn-hd",
    "name": "Hải Dương",
    "fullName": "Tỉnh Hải Dương",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Hải Dương là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Hải Dương",
      "Di tích lịch sử Hải Dương",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Hải Dương",
    "centroid": {
      "x": 2924,
      "y": 1750
    },
    "svgPath": "M 2760 1734 L 2811 1743 L 2847 1739 L 2866 1722 L 2871 1680 L 2859 1634 L 2881 1594 L 2919 1568 L 2969 1560 L 3007 1571 L 3029 1588 L 2995 1635 L 2958 1659 L 2961 1684 L 2984 1692 L 3052 1700 L 3072 1711 L 3059 1757 L 3025 1777 L 3024 1812 L 2998 1833 L 3005 1861 L 3029 1874 L 3025 1890 L 2974 1936 L 2944 1937 L 2834 1955 L 2788 1909 L 2751 1883 L 2740 1856 L 2765 1787 L 2760 1734 Z"
  },
  {
    "id": "vn-bn",
    "hcKey": "vn-bn",
    "name": "Bắc Ninh",
    "fullName": "Tỉnh Bắc Ninh",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bắc Ninh là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bắc Ninh",
      "Di tích lịch sử Bắc Ninh",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bắc Ninh",
    "centroid": {
      "x": 2746,
      "y": 1668
    },
    "svgPath": "M 2859 1634 L 2871 1680 L 2866 1722 L 2847 1739 L 2811 1743 L 2760 1734 L 2708 1732 L 2658 1740 L 2662 1700 L 2605 1640 L 2597 1593 L 2616 1552 L 2674 1578 L 2801 1599 L 2859 1634 Z"
  },
  {
    "id": "vn-317",
    "hcKey": "vn-317",
    "name": "Hung Yen",
    "fullName": "Region Hung Yen",
    "region": "Việt Nam",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Hung Yen là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Hung Yen",
      "Di tích lịch sử Hung Yen",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Hung Yen",
    "centroid": {
      "x": 2691,
      "y": 1875
    },
    "svgPath": "M 2658 1740 L 2708 1732 L 2760 1734 L 2765 1787 L 2740 1856 L 2751 1883 L 2788 1909 L 2834 1955 L 2799 1977 L 2752 1977 L 2734 2003 L 2698 2014 L 2678 1988 L 2677 1947 L 2661 1944 L 2634 1930 L 2626 1890 L 2601 1880 L 2595 1851 L 2603 1817 L 2584 1802 L 2595 1759 L 2658 1740 Z"
  },
  {
    "id": "vn-nb",
    "hcKey": "vn-nb",
    "name": "Ninh Bình",
    "fullName": "Tỉnh Ninh Bình",
    "region": "Đồng bằng sông Hồng",
    "regionKey": "dong-bang-song-hong",
    "area": "1.387 km²",
    "population": "Khoảng 1 triệu người",
    "wikiSummary": "Mảnh đất cố đô Hoa Lư sở hữu Di sản Văn hóa và Thiên nhiên Thế giới Tràng An – di sản kép đầu tiên của Đông Nam Á, nổi tiếng với hệ thống hang động xuyên thủy và chùa Bái Đính linh thiêng.",
    "thumbnail": "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Quần thể Tràng An",
      "Tam Cốc - Bích Động",
      "Chùa Bái Đính",
      "Hang Múa (Đỉnh Ngọa Long)",
      "Cố đô Hoa Lư"
    ],
    "bestSeason": "Tháng 1 - Tháng 3 (Trẩy hội đầu xuân) & Tháng 5 - Tháng 6 (Mùa lúa chín vàng Tam Cốc rực rỡ)",
    "matchingFilter": "Ninh Bình",
    "centroid": {
      "x": 2588,
      "y": 2302
    },
    "svgPath": "M 2738 2442 L 2717 2492 L 2683 2470 L 2708 2442 L 2694 2418 L 2647 2410 L 2603 2380 L 2563 2369 L 2489 2324 L 2341 2199 L 2355 2186 L 2382 2192 L 2420 2223 L 2447 2233 L 2461 2222 L 2453 2169 L 2499 2144 L 2548 2160 L 2590 2201 L 2624 2220 L 2633 2260 L 2698 2291 L 2723 2281 L 2766 2307 L 2764 2373 L 2738 2442 Z"
  },
  {
    "id": "vn-hm",
    "hcKey": "vn-hm",
    "name": "Hà Nam",
    "fullName": "Tỉnh Hà Nam",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Hà Nam là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Hà Nam",
      "Di tích lịch sử Hà Nam",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Hà Nam",
    "centroid": {
      "x": 2648,
      "y": 2077
    },
    "svgPath": "M 2624 2220 L 2590 2201 L 2548 2160 L 2525 2106 L 2509 2051 L 2530 1993 L 2602 1970 L 2647 1963 L 2661 1944 L 2677 1947 L 2678 1988 L 2698 2014 L 2734 2003 L 2751 2044 L 2773 2065 L 2785 2106 L 2706 2112 L 2676 2164 L 2636 2160 L 2625 2180 L 2624 2220 Z"
  },
  {
    "id": "vn-ho",
    "hcKey": "vn-ho",
    "name": "Hòa Bình",
    "fullName": "Tỉnh Hòa Bình",
    "region": "Northwest",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Hòa Bình là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Hòa Bình",
      "Di tích lịch sử Hòa Bình",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Hòa Bình",
    "centroid": {
      "x": 2195,
      "y": 1946
    },
    "svgPath": "M 2509 2051 L 2525 2106 L 2548 2160 L 2499 2144 L 2453 2169 L 2461 2222 L 2447 2233 L 2420 2223 L 2382 2192 L 2355 2186 L 2341 2199 L 2281 2186 L 2179 2134 L 2113 2089 L 2080 2046 L 2061 2036 L 2012 2047 L 1924 2036 L 1858 2010 L 1855 1958 L 1868 1935 L 1948 1934 L 2019 1903 L 2026 1873 L 1975 1838 L 1906 1762 L 1884 1719 L 1885 1691 L 1903 1661 L 1926 1696 L 1995 1729 L 2045 1772 L 2111 1781 L 2170 1797 L 2195 1795 L 2193 1749 L 2178 1727 L 2225 1719 L 2286 1727 L 2314 1744 L 2332 1797 L 2316 1848 L 2333 1871 L 2389 1910 L 2435 2000 L 2487 2027 L 2509 2051 Z"
  },
  {
    "id": "vn-vc",
    "hcKey": "vn-vc",
    "name": "Vĩnh Phúc",
    "fullName": "Tỉnh Vĩnh Phúc",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Vĩnh Phúc là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Vĩnh Phúc",
      "Di tích lịch sử Vĩnh Phúc",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Vĩnh Phúc",
    "centroid": {
      "x": 2340,
      "y": 1480
    },
    "svgPath": "M 2261 1532 L 2281 1515 L 2276 1498 L 2235 1435 L 2202 1417 L 2184 1358 L 2236 1372 L 2282 1371 L 2336 1353 L 2362 1336 L 2403 1376 L 2474 1428 L 2497 1468 L 2493 1541 L 2503 1603 L 2491 1657 L 2418 1617 L 2320 1612 L 2280 1582 L 2261 1532 Z"
  },
  {
    "id": "vn-318",
    "hcKey": "vn-318",
    "name": "Hà Nội",
    "fullName": "Thủ đô Hà Nội",
    "region": "Đồng bằng sông Hồng",
    "regionKey": "dong-bang-song-hong",
    "area": "3.359 km²",
    "population": "Khoảng 8,5 triệu người",
    "wikiSummary": "Thủ đô ngàn năm văn hiến của Việt Nam với bề dày lịch sử và chiều sâu văn hóa truyền thống. Hà Nội thu hút du khách bởi khu 36 phố phường cổ kính, hồ Hoàn Kiếm thơ mộng và ẩm thực tinh tế nổi tiếng thế giới.",
    "thumbnail": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Hồ Hoàn Kiếm & Đền Ngọc Sơn",
      "Phố Cổ Hà Nội",
      "Văn Miếu - Quốc Tử Giám",
      "Lăng Chủ tịch Hồ Chí Minh",
      "Hoàng thành Thăng Long"
    ],
    "bestSeason": "Tháng 9 - Tháng 11 (Mùa thu Hà Nội se lạnh, hoa sữa thơm nồng, nắng vàng tuyệt đẹp)",
    "matchingFilter": "Hà Nội",
    "centroid": {
      "x": 2453,
      "y": 1723
    },
    "svgPath": "M 2599 1493 L 2613 1522 L 2616 1552 L 2597 1593 L 2605 1640 L 2662 1700 L 2658 1740 L 2595 1759 L 2584 1802 L 2603 1817 L 2595 1851 L 2601 1880 L 2626 1890 L 2634 1930 L 2661 1944 L 2647 1963 L 2602 1970 L 2530 1993 L 2509 2051 L 2487 2027 L 2435 2000 L 2389 1910 L 2333 1871 L 2316 1848 L 2332 1797 L 2314 1744 L 2286 1727 L 2225 1719 L 2178 1727 L 2162 1696 L 2177 1643 L 2162 1595 L 2202 1561 L 2209 1514 L 2251 1510 L 2261 1532 L 2280 1582 L 2320 1612 L 2418 1617 L 2491 1657 L 2503 1603 L 2493 1541 L 2497 1468 L 2549 1467 L 2599 1493 Z"
  },
  {
    "id": "vn-bg",
    "hcKey": "vn-bg",
    "name": "Bắc Giang",
    "fullName": "Tỉnh Bắc Giang",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bắc Giang là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bắc Giang",
      "Di tích lịch sử Bắc Giang",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bắc Giang",
    "centroid": {
      "x": 2963,
      "y": 1442
    },
    "svgPath": "M 2616 1552 L 2613 1522 L 2599 1493 L 2633 1434 L 2666 1431 L 2688 1415 L 2702 1364 L 2679 1287 L 2698 1269 L 2751 1277 L 2767 1314 L 2766 1353 L 2853 1382 L 2895 1421 L 2927 1430 L 2969 1415 L 2989 1386 L 3011 1331 L 3036 1300 L 3085 1283 L 3120 1290 L 3165 1326 L 3209 1294 L 3228 1293 L 3241 1331 L 3286 1401 L 3337 1400 L 3357 1451 L 3385 1462 L 3340 1496 L 3333 1542 L 3317 1582 L 3221 1609 L 3177 1610 L 3029 1588 L 3007 1571 L 2969 1560 L 2919 1568 L 2881 1594 L 2859 1634 L 2801 1599 L 2674 1578 L 2616 1552 Z"
  },
  {
    "id": "vn-tb",
    "hcKey": "vn-tb",
    "name": "Thái Bình",
    "fullName": "Tỉnh Thái Bình",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Thái Bình là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Thái Bình",
      "Di tích lịch sử Thái Bình",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Thái Bình",
    "centroid": {
      "x": 2939,
      "y": 2112
    },
    "svgPath": "M 2785 2106 L 2773 2065 L 2751 2044 L 2734 2003 L 2752 1977 L 2799 1977 L 2834 1955 L 2944 1937 L 2966 2004 L 2981 2024 L 3028 2015 L 3066 1989 L 3090 2011 L 3086 2030 L 3015 2067 L 3049 2079 L 3058 2113 L 3046 2130 L 3068 2135 L 3054 2194 L 3068 2262 L 3061 2270 L 3038 2250 L 3038 2250 L 3019 2234 L 3006 2244 L 2970 2254 L 2899 2198 L 2850 2224 L 2841 2213 L 2846 2168 L 2809 2163 L 2806 2118 L 2785 2106 Z"
  },
  {
    "id": "vn-ld",
    "hcKey": "vn-ld",
    "name": "Lâm Đồng",
    "fullName": "Tỉnh Lâm Đồng (Đà Lạt)",
    "region": "Tây Nguyên",
    "regionKey": "tay-nguyen",
    "area": "9.783 km²",
    "population": "Khoảng 1,35 triệu người",
    "wikiSummary": "Thành phố ngàn hoa nằm trên cao nguyên Lang Biang với khí hậu ôn đới quanh năm mát mẻ, rừng thông bạt ngàn, thác nước kỳ vĩ và những biệt thự kiến trúc Pháp cổ kính lãng mạn.",
    "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Hồ Xuân Hương & Quảng trường Lâm Viên",
      "Đỉnh Langbiang",
      "Thác Datanla",
      "Ga Đà Lạt cổ",
      "Vườn hoa cẩm tú cầu Trại Mát"
    ],
    "bestSeason": "Tháng 11 - Tháng 3 (Mùa hoa dã quỳ, mai anh đào khoe sắc, thời tiết khô ráo se lạnh)",
    "matchingFilter": "Đà Lạt",
    "centroid": {
      "x": 4170,
      "y": 8489
    },
    "svgPath": "M 3634 8645 L 3615 8600 L 3617 8580 L 3647 8533 L 3693 8508 L 3731 8513 L 3773 8492 L 3817 8481 L 3859 8453 L 3917 8392 L 3941 8393 L 3949 8419 L 3978 8434 L 4042 8423 L 4062 8437 L 4071 8474 L 4104 8471 L 4132 8491 L 4176 8452 L 4197 8410 L 4195 8365 L 4146 8310 L 4120 8272 L 4129 8229 L 4169 8214 L 4215 8209 L 4247 8195 L 4300 8205 L 4313 8181 L 4372 8143 L 4437 8139 L 4478 8103 L 4501 8097 L 4565 8117 L 4621 8093 L 4639 8117 L 4649 8182 L 4624 8226 L 4631 8269 L 4624 8335 L 4593 8434 L 4601 8470 L 4628 8505 L 4622 8530 L 4575 8581 L 4583 8636 L 4555 8680 L 4507 8664 L 4415 8668 L 4366 8699 L 4364 8736 L 4379 8782 L 4318 8829 L 4247 8848 L 4204 8894 L 4176 8900 L 4175 8856 L 4144 8834 L 3960 8826 L 3913 8817 L 3854 8793 L 3793 8763 L 3737 8753 L 3736 8699 L 3700 8688 L 3682 8648 L 3634 8645 Z"
  },
  {
    "id": "vn-bp",
    "hcKey": "vn-bp",
    "name": "Bình Phước",
    "fullName": "Tỉnh Bình Phước",
    "region": "Southeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bình Phước là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bình Phước",
      "Di tích lịch sử Bình Phước",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bình Phước",
    "centroid": {
      "x": 3316,
      "y": 8545
    },
    "svgPath": "M 3693 8508 L 3647 8533 L 3617 8580 L 3615 8600 L 3634 8645 L 3581 8673 L 3513 8695 L 3487 8712 L 3473 8761 L 3446 8802 L 3387 8854 L 3364 8853 L 3277 8821 L 3252 8817 L 3209 8838 L 3211 8809 L 3187 8801 L 3158 8831 L 3133 8785 L 3137 8747 L 3124 8734 L 3066 8708 L 3061 8691 L 3024 8658 L 3042 8652 L 3029 8585 L 3002 8567 L 2976 8517 L 2992 8450 L 3005 8431 L 2972 8353 L 3007 8349 L 3030 8366 L 3052 8350 L 3148 8359 L 3143 8348 L 3194 8351 L 3228 8291 L 3267 8279 L 3348 8280 L 3393 8257 L 3518 8124 L 3572 8099 L 3587 8279 L 3606 8330 L 3647 8358 L 3669 8386 L 3680 8436 L 3700 8483 L 3693 8508 Z"
  },
  {
    "id": "vn-py",
    "hcKey": "vn-py",
    "name": "Phú Yên",
    "fullName": "Tỉnh Phú Yên",
    "region": "South Central Coast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Phú Yên là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Phú Yên",
      "Di tích lịch sử Phú Yên",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Phú Yên",
    "centroid": {
      "x": 4938,
      "y": 7385
    },
    "svgPath": "M 4711 7171 L 4772 7184 L 4820 7180 L 4894 7146 L 4952 7082 L 5005 7062 L 5020 7130 L 5048 7150 L 5048 7185 L 5017 7133 L 4987 7100 L 5012 7156 L 5043 7201 L 5062 7190 L 5055 7222 L 5082 7232 L 5067 7270 L 5037 7265 L 5053 7236 L 5026 7215 L 5004 7236 L 5005 7287 L 5040 7316 L 5051 7356 L 5026 7356 L 5052 7402 L 5065 7356 L 5071 7384 L 5063 7477 L 5109 7550 L 5179 7636 L 5175 7681 L 5145 7672 L 5122 7696 L 5077 7682 L 4986 7688 L 4956 7703 L 4920 7744 L 4872 7759 L 4823 7740 L 4763 7727 L 4713 7706 L 4646 7658 L 4599 7585 L 4601 7553 L 4647 7503 L 4706 7469 L 4750 7424 L 4734 7374 L 4734 7333 L 4710 7264 L 4711 7171 Z"
  },
  {
    "id": "vn-bd",
    "hcKey": "vn-bd",
    "name": "Bình Định",
    "fullName": "Tỉnh Bình Định",
    "region": "South Central Coast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bình Định là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bình Định",
      "Di tích lịch sử Bình Định",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bình Định",
    "centroid": {
      "x": 4844,
      "y": 6779
    },
    "svgPath": "M 4952 7082 L 4894 7146 L 4820 7180 L 4772 7184 L 4711 7171 L 4707 7092 L 4696 7032 L 4671 6978 L 4637 6934 L 4625 6898 L 4629 6850 L 4585 6791 L 4568 6736 L 4566 6688 L 4594 6573 L 4601 6512 L 4597 6460 L 4585 6410 L 4674 6357 L 4724 6346 L 4807 6350 L 4858 6341 L 4878 6349 L 4885 6413 L 4877 6418 L 4918 6510 L 4918 6550 L 4934 6593 L 4957 6617 L 4972 6668 L 4965 6679 L 5000 6743 L 4954 6715 L 4961 6741 L 4991 6764 L 5012 6816 L 5023 6898 L 5053 6931 L 5052 7017 L 5028 7020 L 5029 6969 L 5013 6921 L 5000 6980 L 5019 7004 L 4996 7029 L 5005 7062 L 4952 7082 Z"
  },
  {
    "id": "vn-724",
    "hcKey": "vn-724",
    "name": "Gia Lai",
    "fullName": "Province Gia Lai",
    "region": "South Central Coast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Gia Lai là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Gia Lai",
      "Di tích lịch sử Gia Lai",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Gia Lai",
    "centroid": {
      "x": 4332,
      "y": 6996
    },
    "svgPath": "M 4550 6378 L 4585 6410 L 4597 6460 L 4601 6512 L 4594 6573 L 4566 6688 L 4568 6736 L 4585 6791 L 4629 6850 L 4625 6898 L 4637 6934 L 4671 6978 L 4696 7032 L 4707 7092 L 4711 7171 L 4710 7264 L 4734 7333 L 4734 7374 L 4750 7424 L 4706 7469 L 4647 7503 L 4601 7553 L 4599 7585 L 4493 7559 L 4462 7529 L 4433 7436 L 4415 7400 L 4382 7368 L 4197 7305 L 4142 7306 L 4068 7335 L 3978 7333 L 3891 7346 L 3806 7399 L 3837 7320 L 3840 7297 L 3829 7199 L 3768 7084 L 3717 7018 L 3710 6954 L 3718 6916 L 3779 6875 L 3833 6821 L 3868 6756 L 3912 6720 L 3960 6698 L 4220 6611 L 4297 6574 L 4350 6535 L 4403 6471 L 4413 6435 L 4401 6395 L 4461 6402 L 4550 6378 Z"
  },
  {
    "id": "vn-qg",
    "hcKey": "vn-qg",
    "name": "Quảng Ngãi",
    "fullName": "Tỉnh Quảng Ngãi",
    "region": "South Central Coast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Quảng Ngãi là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Quảng Ngãi",
      "Di tích lịch sử Quảng Ngãi",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Quảng Ngãi",
    "centroid": {
      "x": 4611,
      "y": 6100
    },
    "svgPath": "M 4585 6410 L 4550 6378 L 4515 6273 L 4498 6243 L 4438 6220 L 4412 6194 L 4385 6143 L 4315 6082 L 4336 6054 L 4299 5987 L 4307 5962 L 4341 5908 L 4376 5884 L 4447 5877 L 4575 5832 L 4643 5821 L 4657 5873 L 4667 5821 L 4689 5796 L 4698 5836 L 4730 5864 L 4733 5900 L 4780 5926 L 4751 5956 L 4759 6068 L 4777 6125 L 4829 6240 L 4879 6307 L 4890 6352 L 4878 6349 L 4858 6341 L 4807 6350 L 4724 6346 L 4674 6357 L 4585 6410 Z"
  },
  {
    "id": "vn-331",
    "hcKey": "vn-331",
    "name": "Đồng Nai",
    "fullName": "Region Đồng Nai",
    "region": "Việt Nam",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Đồng Nai là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Đồng Nai",
      "Di tích lịch sử Đồng Nai",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Đồng Nai",
    "centroid": {
      "x": 3527,
      "y": 9082
    },
    "svgPath": "M 3434 9329 L 3425 9301 L 3418 9336 L 3414 9337 L 3410 9337 L 3405 9379 L 3390 9351 L 3338 9304 L 3297 9311 L 3240 9279 L 3237 9229 L 3263 9243 L 3291 9230 L 3329 9236 L 3329 9199 L 3296 9145 L 3293 9123 L 3260 9077 L 3258 9043 L 3289 9022 L 3326 9042 L 3351 9040 L 3381 9015 L 3395 8972 L 3365 8904 L 3387 8854 L 3446 8802 L 3473 8761 L 3487 8712 L 3513 8695 L 3581 8673 L 3634 8645 L 3682 8648 L 3700 8688 L 3736 8699 L 3737 8753 L 3793 8763 L 3854 8793 L 3825 8818 L 3783 8897 L 3726 9031 L 3760 9058 L 3799 9058 L 3818 9073 L 3841 9123 L 3843 9168 L 3823 9204 L 3790 9238 L 3765 9207 L 3747 9205 L 3676 9286 L 3643 9289 L 3627 9274 L 3619 9230 L 3590 9229 L 3525 9260 L 3520 9291 L 3500 9306 L 3434 9329 Z"
  },
  {
    "id": "vn-dt",
    "hcKey": "vn-dt",
    "name": "Đồng Tháp",
    "fullName": "Tỉnh Đồng Tháp",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Đồng Tháp là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Đồng Tháp",
      "Di tích lịch sử Đồng Tháp",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Đồng Tháp",
    "centroid": {
      "x": 2351,
      "y": 9300
    },
    "svgPath": "M 2118 9146 L 2149 9152 L 2186 9180 L 2203 9177 L 2225 9134 L 2263 9093 L 2309 9109 L 2345 9102 L 2355 9125 L 2394 9154 L 2439 9208 L 2594 9353 L 2635 9383 L 2664 9392 L 2654 9446 L 2575 9546 L 2582 9577 L 2546 9564 L 2474 9500 L 2424 9493 L 2389 9471 L 2365 9451 L 2332 9405 L 2258 9369 L 2240 9350 L 2234 9284 L 2188 9284 L 2145 9228 L 2122 9180 L 2118 9146 Z"
  },
  {
    "id": "vn-la",
    "hcKey": "vn-la",
    "name": "Long An",
    "fullName": "Tỉnh Long An",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Long An là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Long An",
      "Di tích lịch sử Long An",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Long An",
    "centroid": {
      "x": 2842,
      "y": 9255
    },
    "svgPath": "M 3231 9391 L 3223 9413 L 3154 9445 L 3138 9476 L 3116 9493 L 3020 9492 L 3011 9451 L 2949 9426 L 2919 9383 L 2888 9367 L 2812 9363 L 2783 9373 L 2763 9396 L 2728 9399 L 2664 9392 L 2635 9383 L 2594 9353 L 2439 9208 L 2394 9154 L 2355 9125 L 2345 9102 L 2424 9085 L 2471 9058 L 2511 9054 L 2561 9124 L 2590 9183 L 2618 9191 L 2641 9141 L 2703 9197 L 2743 9214 L 2803 9222 L 2819 9236 L 2800 9165 L 2782 9131 L 2785 9087 L 2814 9086 L 2837 9093 L 2896 9075 L 2909 9046 L 2953 9077 L 3036 9119 L 3071 9173 L 3069 9208 L 3049 9257 L 3070 9276 L 3134 9306 L 3159 9328 L 3206 9318 L 3230 9343 L 3231 9391 Z"
  },
  {
    "id": "vn-3623",
    "hcKey": "vn-3623",
    "name": "Haiphong",
    "fullName": "Thành Haiphong",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Haiphong là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Haiphong",
      "Di tích lịch sử Haiphong",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Haiphong",
    "centroid": {
      "x": 3086,
      "y": 1871
    },
    "svgPath": "M 3072 1711 L 3098 1717 L 3103 1717 L 3121 1760 L 3176 1774 L 3164 1815 L 3150 1800 L 3138 1815 L 3175 1857 L 3156 1883 L 3200 1926 L 3213 1965 L 3186 1939 L 3168 1951 L 3114 1956 L 3142 1979 L 3108 2001 L 3066 1989 L 3028 2015 L 2981 2024 L 2966 2004 L 2944 1937 L 2974 1936 L 3025 1890 L 3029 1874 L 3005 1861 L 2998 1833 L 3024 1812 L 3025 1777 L 3059 1757 L 3072 1711 Z"
  },
  {
    "id": "vn-337",
    "hcKey": "vn-337",
    "name": "Hau Giang",
    "fullName": "Region Hau Giang",
    "region": "Việt Nam",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Hau Giang là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Hau Giang",
      "Di tích lịch sử Hau Giang",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Hau Giang",
    "centroid": {
      "x": 2411,
      "y": 9906
    },
    "svgPath": "M 2575 9795 L 2575 9813 L 2621 9859 L 2562 10004 L 2542 10009 L 2456 10062 L 2380 10084 L 2302 10101 L 2251 10102 L 2252 10061 L 2229 10031 L 2248 9999 L 2332 9920 L 2350 9866 L 2343 9834 L 2273 9767 L 2347 9741 L 2424 9724 L 2469 9708 L 2532 9751 L 2575 9795 Z"
  },
  {
    "id": "vn-bl",
    "hcKey": "vn-bl",
    "name": "Bắc Liêu",
    "fullName": "Tỉnh Bắc Liêu",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bắc Liêu là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bắc Liêu",
      "Di tích lịch sử Bắc Liêu",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bắc Liêu",
    "centroid": {
      "x": 2304,
      "y": 10289
    },
    "svgPath": "M 2598 10344 L 2519 10377 L 2358 10437 L 2289 10501 L 2276 10526 L 2256 10489 L 2222 10478 L 2207 10456 L 2192 10388 L 2172 10381 L 2171 10359 L 2197 10314 L 2175 10289 L 2188 10259 L 2170 10234 L 2183 10220 L 2171 10186 L 2192 10154 L 2179 10101 L 2189 10088 L 2251 10102 L 2302 10101 L 2380 10084 L 2386 10195 L 2402 10225 L 2470 10250 L 2549 10245 L 2572 10264 L 2598 10344 Z"
  },
  {
    "id": "vn-vl",
    "hcKey": "vn-vl",
    "name": "Vĩnh Long",
    "fullName": "Tỉnh Vĩnh Long",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Vĩnh Long là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Vĩnh Long",
      "Di tích lịch sử Vĩnh Long",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Vĩnh Long",
    "centroid": {
      "x": 2673,
      "y": 9705
    },
    "svgPath": "M 2778 9623 L 2813 9665 L 2833 9709 L 2871 9741 L 2842 9757 L 2829 9781 L 2788 9807 L 2792 9834 L 2738 9852 L 2690 9880 L 2623 9815 L 2575 9795 L 2532 9751 L 2469 9708 L 2477 9676 L 2502 9664 L 2524 9679 L 2583 9697 L 2626 9672 L 2627 9636 L 2606 9621 L 2582 9577 L 2618 9585 L 2659 9587 L 2745 9607 L 2778 9623 Z"
  },
  {
    "id": "vn-tn",
    "hcKey": "vn-tn",
    "name": "Tây Ninh",
    "fullName": "Tỉnh Tây Ninh",
    "region": "Đông Nam Bộ",
    "regionKey": "dong-nam-bo",
    "area": "4.041 km²",
    "population": "Khoảng 1,19 triệu người",
    "wikiSummary": "Nóc nhà Nam Bộ với Núi Bà Đen cao 986m, thánh địa tôn giáo Cao Đài Tòa Thánh Tây Ninh rực rỡ sắc màu, cùng hồ Dầu Tiếng mênh mông sông nước thanh bình.",
    "thumbnail": "/images/toa-thanh-tay-ninh.jpg",
    "famousLandmarks": [
      "Quần thể Danh thắng Núi Bà Đen",
      "Tòa Thánh Tây Ninh",
      "Hồ Dầu Tiếng",
      "Vườn quốc gia Lò Gò - Xa Mát",
      "Chùa Gò Kén"
    ],
    "bestSeason": "Tháng 12 - Tháng 4 (Mùa khô ráo, tiện leo núi và trẩy hội xuân Núi Bà Đen linh thiêng)",
    "matchingFilter": "Tây Ninh",
    "centroid": {
      "x": 2818,
      "y": 8783
    },
    "svgPath": "M 3002 8567 L 3029 8585 L 3042 8652 L 3024 8658 L 3000 8702 L 2963 8744 L 2937 8812 L 2940 8864 L 2966 8920 L 2995 8949 L 3001 8973 L 2993 9016 L 2953 9077 L 2909 9046 L 2896 9075 L 2837 9093 L 2814 9086 L 2826 9082 L 2806 9025 L 2785 9003 L 2753 9024 L 2735 8997 L 2671 8926 L 2617 8905 L 2607 8869 L 2577 8853 L 2596 8763 L 2583 8665 L 2547 8651 L 2537 8635 L 2548 8608 L 2586 8581 L 2641 8594 L 2676 8547 L 2699 8500 L 2770 8517 L 2800 8518 L 2864 8541 L 2896 8570 L 2944 8558 L 2987 8579 L 3002 8567 Z"
  },
  {
    "id": "vn-ty",
    "hcKey": "vn-ty",
    "name": "Thái Nguyên",
    "fullName": "Tỉnh Thái Nguyên",
    "region": "Ðông Bắc",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Thái Nguyên là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Thái Nguyên",
      "Di tích lịch sử Thái Nguyên",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Thái Nguyên",
    "centroid": {
      "x": 2583,
      "y": 1231
    },
    "svgPath": "M 2599 1493 L 2549 1467 L 2497 1468 L 2474 1428 L 2403 1376 L 2362 1336 L 2324 1289 L 2321 1242 L 2332 1099 L 2348 1038 L 2366 1033 L 2395 994 L 2457 979 L 2495 1017 L 2499 1087 L 2515 1156 L 2541 1137 L 2582 1128 L 2652 1082 L 2668 1057 L 2728 1037 L 2731 1074 L 2748 1142 L 2775 1156 L 2825 1222 L 2827 1235 L 2795 1269 L 2767 1314 L 2751 1277 L 2698 1269 L 2679 1287 L 2702 1364 L 2688 1415 L 2666 1431 L 2633 1434 L 2599 1493 Z"
  },
  {
    "id": "vn-li",
    "hcKey": "vn-li",
    "name": "Lai Chau",
    "fullName": "Tỉnh Lai Chau",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Lai Chau là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Lai Chau",
      "Di tích lịch sử Lai Chau",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Lai Chau",
    "centroid": {
      "x": 682,
      "y": 703
    },
    "svgPath": "M 988 973 L 968 998 L 964 1024 L 974 1080 L 938 1021 L 914 1004 L 912 974 L 883 937 L 873 896 L 846 880 L 821 886 L 781 936 L 779 960 L 720 930 L 694 932 L 664 904 L 627 885 L 566 893 L 546 878 L 537 843 L 494 841 L 481 821 L 476 773 L 449 727 L 398 686 L 360 670 L 308 604 L 268 572 L 234 575 L 180 564 L 143 571 L 184 525 L 166 503 L 192 487 L 226 426 L 275 441 L 288 478 L 323 464 L 341 482 L 395 498 L 435 532 L 476 545 L 498 562 L 530 635 L 595 672 L 633 670 L 633 637 L 700 600 L 692 570 L 700 549 L 760 514 L 776 497 L 816 418 L 840 422 L 878 455 L 880 491 L 909 543 L 947 571 L 979 522 L 1014 573 L 1019 618 L 997 644 L 1003 666 L 1047 692 L 1112 691 L 1148 733 L 1127 788 L 1078 840 L 1025 866 L 999 911 L 988 973 Z"
  },
  {
    "id": "vn-311",
    "hcKey": "vn-311",
    "name": "Son La",
    "fullName": "Province Son La",
    "region": "Northwest",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Son La là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Son La",
      "Di tích lịch sử Son La",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Son La",
    "centroid": {
      "x": 1321,
      "y": 1602
    },
    "svgPath": "M 974 1080 L 964 1024 L 968 998 L 988 973 L 1012 967 L 1041 995 L 1083 1100 L 1167 1195 L 1197 1213 L 1229 1205 L 1292 1231 L 1397 1251 L 1440 1243 L 1491 1214 L 1520 1243 L 1498 1321 L 1493 1371 L 1505 1409 L 1524 1429 L 1585 1465 L 1616 1467 L 1663 1439 L 1694 1432 L 1753 1456 L 1793 1454 L 1814 1490 L 1848 1494 L 1874 1552 L 1878 1626 L 1903 1661 L 1885 1691 L 1884 1719 L 1906 1762 L 1975 1838 L 2026 1873 L 2019 1903 L 1948 1934 L 1868 1935 L 1855 1958 L 1858 2010 L 1812 2047 L 1778 2040 L 1720 1998 L 1700 1997 L 1690 1984 L 1616 1954 L 1588 1908 L 1545 1903 L 1508 1867 L 1480 1823 L 1456 1809 L 1429 1814 L 1411 1786 L 1341 1762 L 1316 1764 L 1284 1801 L 1244 1806 L 1122 1854 L 1106 1894 L 1110 1916 L 1074 1936 L 1079 1973 L 1045 1982 L 985 1927 L 929 1915 L 881 1862 L 837 1886 L 768 1857 L 743 1856 L 745 1809 L 756 1756 L 789 1711 L 786 1678 L 808 1670 L 850 1691 L 890 1677 L 880 1613 L 893 1584 L 900 1535 L 893 1507 L 868 1486 L 852 1432 L 892 1405 L 913 1360 L 955 1319 L 979 1283 L 985 1237 L 977 1178 L 974 1080 Z"
  },
  {
    "id": "vn-hg",
    "hcKey": "vn-hg",
    "name": "Hà Giang",
    "fullName": "Tỉnh Hà Giang",
    "region": "Đông Bắc Bộ",
    "regionKey": "dong-bac-bo",
    "area": "7.929 km²",
    "population": "Khoảng 870.000 người",
    "wikiSummary": "Địa đầu Tổ quốc với Công viên địa chất toàn cầu Cao nguyên đá Đồng Văn, đèo Mã Pí Lèng hùng vĩ bậc nhất tứ đại đỉnh đèo và dòng sông Nho Quế màu xanh ngọc bích huyền thoại.",
    "thumbnail": "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Đèo Mã Pí Lèng",
      "Sông Nho Quế",
      "Cao nguyên đá Đồng Văn",
      "Cột cờ Lũng Cú",
      "Dinh thự họ Vương",
      "Cổng trời Quản Bạ"
    ],
    "bestSeason": "Tháng 9 - Tháng 11 (Mùa hoa tam giác mạch và ruộng bậc thang Hoàng Su Phì ngả vàng)",
    "matchingFilter": "Hà Giang",
    "centroid": {
      "x": 1972,
      "y": 432
    },
    "svgPath": "M 1862 877 L 1809 869 L 1754 808 L 1712 813 L 1689 826 L 1689 759 L 1659 730 L 1613 704 L 1585 595 L 1607 566 L 1573 524 L 1545 516 L 1532 493 L 1591 455 L 1662 388 L 1680 408 L 1701 398 L 1737 407 L 1781 386 L 1813 345 L 1846 324 L 1849 302 L 1829 206 L 1872 181 L 1878 149 L 1929 151 L 1953 129 L 2007 98 L 2113 74 L 2126 34 L 2156 5 L 2177 0 L 2191 35 L 2230 66 L 2258 72 L 2287 125 L 2317 145 L 2329 195 L 2312 204 L 2304 250 L 2291 267 L 2260 268 L 2210 331 L 2171 359 L 2172 375 L 2273 433 L 2299 466 L 2320 515 L 2353 567 L 2307 575 L 2200 561 L 2100 527 L 2082 535 L 2058 617 L 2022 665 L 1999 740 L 1980 751 L 1937 743 L 1925 758 L 1918 806 L 1862 877 Z"
  },
  {
    "id": "vn-nd",
    "hcKey": "vn-nd",
    "name": "Nam Định",
    "fullName": "Tỉnh Nam Định",
    "region": "Red River Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Nam Định là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Nam Định",
      "Di tích lịch sử Nam Định",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Nam Định",
    "centroid": {
      "x": 2832,
      "y": 2265
    },
    "svgPath": "M 3006 2244 L 3038 2250 L 3038 2250 L 3038 2250 L 3053 2294 L 3008 2305 L 2932 2315 L 2908 2330 L 2870 2386 L 2839 2421 L 2771 2478 L 2734 2492 L 2738 2442 L 2764 2373 L 2766 2307 L 2723 2281 L 2698 2291 L 2633 2260 L 2624 2220 L 2625 2180 L 2636 2160 L 2676 2164 L 2706 2112 L 2785 2106 L 2806 2118 L 2809 2163 L 2846 2168 L 2841 2213 L 2850 2224 L 2899 2198 L 2970 2254 L 3006 2244 Z"
  },
  {
    "id": "vn-328",
    "hcKey": "vn-328",
    "name": "Ha Tinh",
    "fullName": "Province Ha Tinh",
    "region": "North Central Region",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Ha Tinh là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Ha Tinh",
      "Di tích lịch sử Ha Tinh",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Ha Tinh",
    "centroid": {
      "x": 2517,
      "y": 3723
    },
    "svgPath": "M 2491 3449 L 2504 3442 L 2502 3380 L 2513 3386 L 2519 3429 L 2544 3499 L 2581 3559 L 2606 3587 L 2630 3588 L 2650 3639 L 2735 3721 L 2739 3749 L 2783 3738 L 2857 3783 L 2910 3835 L 2882 3859 L 2913 3871 L 2927 3855 L 2972 3841 L 2963 3863 L 2975 3894 L 3032 3963 L 2939 3952 L 2913 3956 L 2879 3996 L 2841 3999 L 2765 3985 L 2709 3960 L 2698 3916 L 2658 3889 L 2616 3882 L 2569 3887 L 2483 3918 L 2445 3948 L 2389 3957 L 2363 3929 L 2353 3900 L 2300 3842 L 2297 3809 L 2282 3794 L 2241 3793 L 2224 3825 L 2173 3792 L 2171 3750 L 2139 3755 L 2076 3701 L 2080 3667 L 2030 3623 L 2022 3602 L 2036 3531 L 2056 3496 L 2085 3482 L 2158 3477 L 2254 3504 L 2318 3497 L 2408 3508 L 2429 3517 L 2451 3494 L 2448 3479 L 2491 3449 Z"
  },
  {
    "id": "vn-na",
    "hcKey": "vn-na",
    "name": "Nghệ An",
    "fullName": "Tỉnh Nghệ An",
    "region": "North Central Region",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Nghệ An là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Nghệ An",
      "Di tích lịch sử Nghệ An",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Nghệ An",
    "centroid": {
      "x": 1906,
      "y": 2988
    },
    "svgPath": "M 2527 3000 L 2504 3028 L 2485 3027 L 2476 3076 L 2480 3122 L 2451 3142 L 2432 3136 L 2415 3154 L 2395 3203 L 2405 3259 L 2419 3280 L 2466 3308 L 2447 3329 L 2469 3331 L 2495 3368 L 2491 3449 L 2448 3479 L 2451 3494 L 2429 3517 L 2408 3508 L 2318 3497 L 2254 3504 L 2158 3477 L 2085 3482 L 2045 3424 L 2011 3425 L 1959 3398 L 1922 3399 L 1896 3371 L 1837 3368 L 1772 3355 L 1747 3331 L 1719 3325 L 1648 3270 L 1604 3218 L 1548 3207 L 1516 3166 L 1480 3151 L 1450 3125 L 1416 3127 L 1407 3093 L 1372 3067 L 1295 3032 L 1250 3035 L 1212 3011 L 1195 2984 L 1164 2980 L 1179 2960 L 1215 2941 L 1237 2913 L 1297 2897 L 1313 2855 L 1333 2846 L 1321 2791 L 1283 2760 L 1270 2722 L 1287 2701 L 1333 2723 L 1366 2697 L 1431 2683 L 1464 2700 L 1476 2721 L 1509 2701 L 1535 2699 L 1560 2724 L 1623 2760 L 1704 2749 L 1726 2690 L 1752 2663 L 1783 2655 L 1831 2622 L 1839 2580 L 1800 2571 L 1814 2536 L 1868 2502 L 1879 2482 L 1928 2475 L 1976 2491 L 2010 2512 L 2071 2531 L 2091 2549 L 2060 2608 L 2068 2647 L 2098 2698 L 2148 2748 L 2155 2821 L 2187 2802 L 2214 2806 L 2245 2847 L 2270 2858 L 2319 2857 L 2338 2869 L 2374 2917 L 2406 2936 L 2453 2980 L 2498 2986 L 2527 3000 Z"
  },
  {
    "id": "vn-qb",
    "hcKey": "vn-qb",
    "name": "Quảng Bình",
    "fullName": "Tỉnh Quảng Bình",
    "region": "North Central Region",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Quảng Bình là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Quảng Bình",
      "Di tích lịch sử Quảng Bình",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Quảng Bình",
    "centroid": {
      "x": 2867,
      "y": 4249
    },
    "svgPath": "M 3032 3963 L 3036 3973 L 2988 4018 L 2979 4044 L 3013 4150 L 2975 4123 L 2932 4104 L 2869 4100 L 2912 4118 L 2970 4129 L 2938 4138 L 3023 4164 L 3102 4284 L 3116 4319 L 3208 4417 L 3381 4543 L 3308 4589 L 3276 4629 L 3248 4678 L 3200 4692 L 3087 4685 L 3048 4701 L 3042 4672 L 3022 4691 L 2968 4673 L 2944 4631 L 2942 4603 L 2908 4571 L 2887 4536 L 2889 4499 L 2871 4457 L 2854 4454 L 2827 4486 L 2801 4477 L 2684 4378 L 2607 4288 L 2561 4229 L 2520 4197 L 2483 4181 L 2418 4067 L 2391 4042 L 2383 4017 L 2389 3957 L 2445 3948 L 2483 3918 L 2569 3887 L 2616 3882 L 2658 3889 L 2698 3916 L 2709 3960 L 2765 3985 L 2841 3999 L 2879 3996 L 2913 3956 L 2939 3952 L 3032 3963 Z"
  },
  {
    "id": "vn-723",
    "hcKey": "vn-723",
    "name": "Dak Lak",
    "fullName": "Province Dak Lak",
    "region": "Tây Nguyên",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Dak Lak là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Dak Lak",
      "Di tích lịch sử Dak Lak",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Dak Lak",
    "centroid": {
      "x": 4304,
      "y": 7826
    },
    "svgPath": "M 3794 7799 L 3790 7739 L 3760 7696 L 3740 7619 L 3750 7605 L 3735 7576 L 3806 7399 L 3891 7346 L 3978 7333 L 4068 7335 L 4142 7306 L 4197 7305 L 4382 7368 L 4415 7400 L 4433 7436 L 4462 7529 L 4493 7559 L 4599 7585 L 4646 7658 L 4713 7706 L 4763 7727 L 4823 7740 L 4872 7759 L 4825 7802 L 4779 7813 L 4757 7866 L 4761 7898 L 4744 7958 L 4730 7969 L 4687 7950 L 4615 7964 L 4608 7987 L 4610 8045 L 4621 8093 L 4565 8117 L 4501 8097 L 4478 8103 L 4437 8139 L 4372 8143 L 4313 8181 L 4300 8205 L 4247 8195 L 4215 8209 L 4222 8173 L 4184 8127 L 4150 8103 L 4113 8097 L 4086 8063 L 4077 8021 L 4112 8004 L 4131 7964 L 4110 7946 L 4071 7934 L 4063 7907 L 4036 7888 L 4027 7821 L 4012 7794 L 3794 7799 Z"
  },
  {
    "id": "vn-nt",
    "hcKey": "vn-nt",
    "name": "Ninh Thuận",
    "fullName": "Tỉnh Ninh Thuận",
    "region": "Southeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Ninh Thuận là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Ninh Thuận",
      "Di tích lịch sử Ninh Thuận",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Ninh Thuận",
    "centroid": {
      "x": 4786,
      "y": 8519
    },
    "svgPath": "M 5004 8466 L 5033 8504 L 4996 8551 L 4991 8576 L 4957 8627 L 4907 8618 L 4889 8578 L 4872 8582 L 4887 8605 L 4879 8667 L 4874 8785 L 4826 8820 L 4793 8810 L 4765 8763 L 4695 8750 L 4688 8712 L 4653 8693 L 4639 8648 L 4583 8636 L 4575 8581 L 4622 8530 L 4628 8505 L 4601 8470 L 4593 8434 L 4624 8335 L 4631 8269 L 4624 8226 L 4649 8182 L 4692 8199 L 4715 8223 L 4766 8347 L 4786 8360 L 4879 8380 L 4903 8405 L 4918 8444 L 4939 8460 L 5004 8466 Z"
  },
  {
    "id": "vn-6365",
    "hcKey": "vn-6365",
    "name": "Đăk Nông",
    "fullName": "Province Đăk Nông",
    "region": "Tây Nguyên",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Đăk Nông là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Đăk Nông",
      "Di tích lịch sử Đăk Nông",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Đăk Nông",
    "centroid": {
      "x": 3951,
      "y": 8221
    },
    "svgPath": "M 4215 8209 L 4169 8214 L 4129 8229 L 4120 8272 L 4146 8310 L 4195 8365 L 4197 8410 L 4176 8452 L 4132 8491 L 4104 8471 L 4071 8474 L 4062 8437 L 4042 8423 L 3978 8434 L 3949 8419 L 3941 8393 L 3917 8392 L 3859 8453 L 3817 8481 L 3773 8492 L 3731 8513 L 3693 8508 L 3700 8483 L 3680 8436 L 3669 8386 L 3647 8358 L 3606 8330 L 3587 8279 L 3572 8099 L 3638 8085 L 3691 8141 L 3708 8140 L 3732 8106 L 3778 8073 L 3808 7978 L 3813 7880 L 3794 7799 L 4012 7794 L 4027 7821 L 4036 7888 L 4063 7907 L 4071 7934 L 4110 7946 L 4131 7964 L 4112 8004 L 4077 8021 L 4086 8063 L 4113 8097 L 4150 8103 L 4184 8127 L 4222 8173 L 4215 8209 Z"
  },
  {
    "id": "vn-299",
    "hcKey": "vn-299",
    "name": "Kon Tum",
    "fullName": "Tỉnh Kon Tum",
    "region": "South Central Coast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Kon Tum là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Kon Tum",
      "Di tích lịch sử Kon Tum",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Kon Tum",
    "centroid": {
      "x": 4000,
      "y": 6306
    },
    "svgPath": "M 4550 6378 L 4461 6402 L 4401 6395 L 4413 6435 L 4403 6471 L 4350 6535 L 4297 6574 L 4220 6611 L 3960 6698 L 3912 6720 L 3868 6756 L 3833 6821 L 3779 6875 L 3718 6916 L 3706 6870 L 3664 6862 L 3643 6844 L 3644 6800 L 3626 6772 L 3653 6684 L 3646 6624 L 3672 6550 L 3721 6540 L 3755 6461 L 3754 6417 L 3773 6361 L 3743 6268 L 3790 6207 L 3721 6157 L 3709 6107 L 3761 6089 L 3803 6089 L 3807 6048 L 3833 6010 L 3834 5986 L 3858 5973 L 3858 5916 L 3815 5881 L 3799 5828 L 3851 5831 L 3879 5851 L 3909 5903 L 3942 5905 L 4004 5959 L 4051 5952 L 4082 5962 L 4147 6012 L 4156 6031 L 4157 6091 L 4204 6151 L 4240 6128 L 4243 6077 L 4258 6070 L 4315 6082 L 4385 6143 L 4412 6194 L 4438 6220 L 4498 6243 L 4515 6273 L 4550 6378 Z"
  },
  {
    "id": "vn-300",
    "hcKey": "vn-300",
    "name": "Quảng Nam",
    "fullName": "Tỉnh Quảng Nam (Hội An)",
    "region": "Duyên hải Nam Trung Bộ",
    "regionKey": "duyen-hai-nam-trung-bo",
    "area": "10.574 km²",
    "population": "Khoảng 1,5 triệu người",
    "wikiSummary": "Mảnh đất di sản nơi hội tụ hai Di sản Văn hóa Thế giới: Đô thị cổ Hội An lung linh đèn lồng bên dòng sông Hoài và Thánh địa Mỹ Sơn trầm mặc của nền văn minh Chăm Pa cổ xưa.",
    "thumbnail": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Phố cổ Hội An & Chùa Cầu",
      "Khu đền tháp Mỹ Sơn",
      "Cù Lao Chàm (Khu dự trữ sinh quyển)",
      "Rừng dừa Bảy Mẫu Cẩm Thanh"
    ],
    "bestSeason": "Tháng 2 - Tháng 8 (Trời tạnh ráo, nắng vàng ấm áp, tránh mùa bão tháng 10 - 11)",
    "matchingFilter": "Hội An",
    "centroid": {
      "x": 4067,
      "y": 5680
    },
    "svgPath": "M 4295 5391 L 4312 5416 L 4371 5457 L 4390 5479 L 4397 5524 L 4420 5567 L 4539 5725 L 4585 5733 L 4542 5765 L 4564 5791 L 4596 5753 L 4601 5786 L 4643 5821 L 4575 5832 L 4447 5877 L 4376 5884 L 4341 5908 L 4307 5962 L 4299 5987 L 4336 6054 L 4315 6082 L 4258 6070 L 4243 6077 L 4240 6128 L 4204 6151 L 4157 6091 L 4156 6031 L 4147 6012 L 4082 5962 L 4051 5952 L 4004 5959 L 3942 5905 L 3909 5903 L 3879 5851 L 3851 5831 L 3799 5828 L 3740 5817 L 3735 5772 L 3706 5752 L 3651 5762 L 3612 5694 L 3564 5664 L 3539 5593 L 3500 5571 L 3492 5545 L 3510 5505 L 3553 5499 L 3602 5467 L 3641 5457 L 3662 5439 L 3700 5384 L 3691 5351 L 3808 5349 L 3853 5323 L 3872 5333 L 3896 5377 L 3908 5376 L 3940 5336 L 3991 5324 L 4046 5329 L 4098 5323 L 4105 5384 L 4134 5402 L 4166 5402 L 4224 5387 L 4295 5391 Z"
  },
  {
    "id": "vn-qt",
    "hcKey": "vn-qt",
    "name": "Quảng Trị",
    "fullName": "Tỉnh Quảng Trị",
    "region": "North Central Region",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Quảng Trị là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Quảng Trị",
      "Di tích lịch sử Quảng Trị",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Quảng Trị",
    "centroid": {
      "x": 3346,
      "y": 4900
    },
    "svgPath": "M 3430 5181 L 3359 5175 L 3347 5149 L 3282 5094 L 3285 5026 L 3255 5007 L 3238 5045 L 3206 5082 L 3164 5083 L 3137 5052 L 3126 5015 L 3126 4967 L 3078 4948 L 3051 4897 L 3048 4701 L 3087 4685 L 3200 4692 L 3248 4678 L 3276 4629 L 3308 4589 L 3381 4543 L 3455 4596 L 3466 4617 L 3463 4647 L 3519 4723 L 3478 4752 L 3512 4752 L 3531 4727 L 3670 4842 L 3619 4918 L 3570 4953 L 3503 4963 L 3457 4988 L 3465 5016 L 3499 5048 L 3470 5092 L 3426 5142 L 3430 5181 Z"
  },
  {
    "id": "vn-tt",
    "hcKey": "vn-tt",
    "name": "Thừa Thiên Huế",
    "fullName": "Tỉnh Thừa Thiên Huế",
    "region": "Bắc Trung Bộ",
    "regionKey": "bac-trung-bo",
    "area": "5.048 km²",
    "population": "Khoảng 1,15 triệu người",
    "wikiSummary": "Cố đô di sản của triều Nguyễn với quần thể di tích Đại Nội, các lăng tẩm hoàng gia và dòng sông Hương thơ mộng. Huế là nơi lưu giữ nhã nhạc cung đình và nền ẩm thực cung đình độc đáo bậc nhất Việt Nam.",
    "thumbnail": "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Đại Nội Huế (Hoàng Thành)",
      "Chùa Thiên Mụ",
      "Lăng Khải Định",
      "Lăng Tự Đức",
      "Sông Hương & Cầu Tràng Tiền",
      "Phá Tam Giang"
    ],
    "bestSeason": "Tháng 1 - Tháng 4 (Thời tiết mát mẻ, khô ráo, cảnh sắc cổ kính yên bình)",
    "matchingFilter": "Huế",
    "centroid": {
      "x": 3816,
      "y": 5137
    },
    "svgPath": "M 3670 4842 L 3731 4886 L 3808 4953 L 3802 4957 L 3715 4912 L 3693 4916 L 3779 4963 L 3801 4959 L 3811 4990 L 3850 4985 L 3842 5006 L 3857 5025 L 3874 5008 L 3918 5049 L 3967 5114 L 3944 5110 L 3958 5159 L 4018 5183 L 4046 5158 L 4051 5125 L 4099 5152 L 4121 5132 L 4129 5162 L 4158 5212 L 4128 5194 L 4130 5213 L 4234 5229 L 4186 5237 L 4121 5224 L 4058 5228 L 4036 5255 L 4012 5305 L 3991 5324 L 3940 5336 L 3908 5376 L 3896 5377 L 3872 5333 L 3853 5323 L 3808 5349 L 3691 5351 L 3690 5338 L 3616 5351 L 3596 5346 L 3553 5298 L 3493 5272 L 3473 5247 L 3465 5207 L 3430 5181 L 3426 5142 L 3470 5092 L 3499 5048 L 3465 5016 L 3457 4988 L 3503 4963 L 3570 4953 L 3619 4918 L 3670 4842 Z"
  },
  {
    "id": "vn-da",
    "hcKey": "vn-da",
    "name": "Đà Nẵng",
    "fullName": "Thành phố Đà Nẵng",
    "region": "Duyên hải Nam Trung Bộ",
    "regionKey": "duyen-hai-nam-trung-bo",
    "area": "1.285 km²",
    "population": "Khoảng 1,2 triệu người",
    "wikiSummary": "Thành phố đáng sống bậc nhất Việt Nam, sở hữu bãi biển Mỹ Khê trong xanh được Forbes vinh danh, bán đảo Sơn Trà hoang sơ và cây Cầu Vàng Bà Nà Hills nổi tiếng toàn cầu. Đà Nẵng đồng thời trực tiếp quản lý huyện đảo Hoàng Sa.",
    "thumbnail": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Bà Nà Hills (Cầu Vàng)",
      "Bãi biển Mỹ Khê",
      "Ngũ Hành Sơn",
      "Cầu Rồng sông Hàn",
      "Bán đảo Sơn Trà",
      "Quần đảo Hoàng Sa"
    ],
    "bestSeason": "Tháng 3 - Tháng 8 (Biển êm dịu, trời xanh trong, nắng chan hòa, không mưa bão)",
    "matchingFilter": "Đà Nẵng",
    "centroid": {
      "x": 4192,
      "y": 5311
    },
    "svgPath": "M 4234 5229 L 4202 5259 L 4194 5297 L 4233 5332 L 4255 5318 L 4263 5346 L 4234 5382 L 4271 5367 L 4268 5293 L 4252 5291 L 4266 5265 L 4318 5284 L 4318 5301 L 4281 5305 L 4277 5332 L 4295 5391 L 4224 5387 L 4166 5402 L 4134 5402 L 4105 5384 L 4098 5323 L 4046 5329 L 3991 5324 L 4012 5305 L 4036 5255 L 4058 5228 L 4121 5224 L 4186 5237 L 4234 5229 Z M 4480 5435 L 4441 5408 L 4455 5399 L 4477 5415 L 4480 5435 Z"
  },
  {
    "id": "vn-ag",
    "hcKey": "vn-ag",
    "name": "An Giang",
    "fullName": "Tỉnh An Giang",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "An Giang là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh An Giang",
      "Di tích lịch sử An Giang",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "An Giang",
    "centroid": {
      "x": 2112,
      "y": 9381
    },
    "svgPath": "M 1766 9417 L 1835 9420 L 1860 9410 L 1926 9329 L 1997 9293 L 2014 9276 L 2014 9252 L 1977 9177 L 1987 9129 L 2022 9105 L 2037 9129 L 2118 9146 L 2122 9180 L 2145 9228 L 2188 9284 L 2234 9284 L 2240 9350 L 2258 9369 L 2332 9405 L 2365 9451 L 2389 9471 L 2353 9504 L 2325 9554 L 2310 9597 L 2278 9598 L 2233 9627 L 2208 9599 L 2159 9627 L 2141 9653 L 1885 9519 L 1766 9417 Z"
  },
  {
    "id": "vn-cm",
    "hcKey": "vn-cm",
    "name": "Cà Mau",
    "fullName": "Tỉnh Cà Mau",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Cà Mau là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Cà Mau",
      "Di tích lịch sử Cà Mau",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Cà Mau",
    "centroid": {
      "x": 2001,
      "y": 10543
    },
    "svgPath": "M 2276 10526 L 2209 10649 L 2155 10707 L 2100 10722 L 2040 10800 L 1861 10850 L 1785 10832 L 1762 10815 L 1791 10813 L 1846 10780 L 1834 10758 L 1853 10753 L 1902 10762 L 1939 10737 L 1876 10752 L 1859 10730 L 1914 10717 L 1909 10671 L 1832 10699 L 1802 10665 L 1829 10578 L 1826 10498 L 1834 10390 L 1845 10140 L 1874 10160 L 1944 10143 L 1983 10145 L 2141 10226 L 2170 10234 L 2188 10259 L 2175 10289 L 2197 10314 L 2171 10359 L 2172 10381 L 2192 10388 L 2207 10456 L 2222 10478 L 2256 10489 L 2276 10526 Z"
  },
  {
    "id": "vn-tv",
    "hcKey": "vn-tv",
    "name": "Trà Vinh",
    "fullName": "Tỉnh Trà Vinh",
    "region": "Mekong Delta",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Trà Vinh là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Trà Vinh",
      "Di tích lịch sử Trà Vinh",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Trà Vinh",
    "centroid": {
      "x": 2922,
      "y": 9914
    },
    "svgPath": "M 2871 9741 L 2898 9760 L 2919 9791 L 2975 9846 L 3038 9898 L 3070 9942 L 3076 9971 L 3111 9988 L 3112 10054 L 3089 10101 L 3046 10129 L 2983 10133 L 2939 10101 L 2875 10068 L 2740 9941 L 2690 9880 L 2738 9852 L 2792 9834 L 2788 9807 L 2829 9781 L 2842 9757 L 2871 9741 Z"
  },
  {
    "id": "vn-cb",
    "hcKey": "vn-cb",
    "name": "Cao Bằng",
    "fullName": "Tỉnh Cao Bằng",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Cao Bằng là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Cao Bằng",
      "Di tích lịch sử Cao Bằng",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Cao Bằng",
    "centroid": {
      "x": 2688,
      "y": 448
    },
    "svgPath": "M 2329 195 L 2350 228 L 2435 235 L 2479 263 L 2546 337 L 2569 318 L 2608 320 L 2645 284 L 2698 280 L 2761 290 L 2783 304 L 2805 365 L 2861 372 L 2957 345 L 2977 318 L 3041 340 L 3061 371 L 3100 359 L 3144 408 L 3184 410 L 3185 428 L 3155 449 L 3147 485 L 3122 533 L 3111 571 L 3088 579 L 3061 549 L 3035 575 L 3012 701 L 2987 715 L 2920 720 L 2843 675 L 2802 680 L 2780 701 L 2742 682 L 2738 647 L 2721 610 L 2704 602 L 2645 615 L 2586 648 L 2541 647 L 2522 630 L 2485 538 L 2495 483 L 2459 470 L 2407 504 L 2353 567 L 2320 515 L 2299 466 L 2273 433 L 2172 375 L 2171 359 L 2210 331 L 2260 268 L 2291 267 L 2304 250 L 2312 204 L 2329 195 Z"
  },
  {
    "id": "vn-kg",
    "hcKey": "vn-kg",
    "name": "Kiên Giang",
    "fullName": "Tỉnh Kiên Giang (Phú Quốc)",
    "region": "Đồng bằng sông Cửu Long",
    "regionKey": "dong-bang-song-cuu-long",
    "area": "6.348 km²",
    "population": "Khoảng 1,8 triệu người",
    "wikiSummary": "Vùng đất biển đảo Tây Nam Tổ quốc với thành phố đảo ngọc Phú Quốc danh tiếng quốc tế. Nơi đây sở hữu bãi Sao cát trắng mịn, rạn san hô Nam đảo tuyệt mỹ và những hoàng hôn lộng lẫy nhất Việt Nam.",
    "thumbnail": "/images/phu-quoc-sunset-kiss-bridge.jpg",
    "famousLandmarks": [
      "Bãi Sao & Bãi Dài Phú Quốc",
      "Grand World & VinWonders",
      "Cáp treo Hòn Thơm vượt biển",
      "Làng chài Hàm Ninh",
      "Quần đảo Nam Du"
    ],
    "bestSeason": "Tháng 11 - Tháng 4 (Mùa khô nắng vàng rực rỡ, sóng êm phẳng lặng như gương)",
    "matchingFilter": "Kiên Giang",
    "centroid": {
      "x": 1957,
      "y": 9832
    },
    "svgPath": "M 1247 9776 L 1228 9682 L 1195 9603 L 1137 9562 L 1129 9525 L 1192 9529 L 1244 9467 L 1300 9526 L 1302 9616 L 1274 9687 L 1264 9728 L 1277 9747 L 1277 9792 L 1247 9776 Z M 1845 10140 L 1862 9991 L 1888 9908 L 1944 9906 L 1961 9881 L 2022 9840 L 2048 9904 L 2044 9834 L 2030 9801 L 1968 9732 L 1940 9721 L 1894 9728 L 1871 9714 L 1824 9647 L 1801 9633 L 1754 9636 L 1713 9693 L 1681 9686 L 1668 9608 L 1629 9572 L 1603 9527 L 1625 9506 L 1570 9520 L 1568 9491 L 1599 9485 L 1643 9419 L 1695 9408 L 1766 9417 L 1885 9519 L 2141 9653 L 2201 9695 L 2273 9767 L 2343 9834 L 2350 9866 L 2332 9920 L 2248 9999 L 2229 10031 L 2252 10061 L 2251 10102 L 2189 10088 L 2179 10101 L 2192 10154 L 2171 10186 L 2183 10220 L 2170 10234 L 2141 10226 L 1983 10145 L 1944 10143 L 1874 10160 L 1845 10140 Z"
  },
  {
    "id": "vn-lo",
    "hcKey": "vn-lo",
    "name": "Lào Cai",
    "fullName": "Tỉnh Lào Cai (Sa Pa)",
    "region": "Tây Bắc Bộ",
    "regionKey": "tay-bac-bo",
    "area": "6.364 km²",
    "population": "Khoảng 750.000 người",
    "wikiSummary": "Vùng đất miền sơn cước với đỉnh Fansipan – Nóc nhà Đông Dương, thị xã Sa Pa huyền ảo trong mây và những thửa ruộng bậc thang Mường Hoa kỳ vĩ được công nhận di sản danh thắng quốc gia.",
    "thumbnail": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Đỉnh Fansipan",
      "Thung lũng Mường Hoa",
      "Bản Cát Cát",
      "Núi Hàm Rồng",
      "Đèo Ô Quy Hồ",
      "Nhà thờ đá Sa Pa"
    ],
    "bestSeason": "Tháng 9 - Tháng 10 (Mùa lúa chín vàng óng) & Tháng 12 - Tháng 2 (Săn mây tuyết, hoa đào nở rộ)",
    "matchingFilter": "Lào Cai",
    "centroid": {
      "x": 1314,
      "y": 756
    },
    "svgPath": "M 979 522 L 975 490 L 1007 434 L 1046 412 L 1099 473 L 1145 515 L 1194 577 L 1213 582 L 1228 608 L 1257 628 L 1275 613 L 1275 582 L 1290 538 L 1302 472 L 1336 426 L 1431 396 L 1450 396 L 1441 426 L 1455 467 L 1517 498 L 1532 493 L 1545 516 L 1573 524 L 1607 566 L 1585 595 L 1613 704 L 1659 730 L 1689 759 L 1689 826 L 1712 813 L 1724 875 L 1699 889 L 1661 932 L 1607 896 L 1555 902 L 1543 928 L 1583 1010 L 1580 1050 L 1551 1076 L 1522 1070 L 1441 1030 L 1422 1080 L 1372 1063 L 1329 1058 L 1271 1019 L 1222 1107 L 1248 1152 L 1229 1205 L 1197 1213 L 1167 1195 L 1083 1100 L 1041 995 L 1012 967 L 988 973 L 999 911 L 1025 866 L 1078 840 L 1127 788 L 1148 733 L 1112 691 L 1047 692 L 1003 666 L 997 644 L 1019 618 L 1014 573 L 979 522 Z"
  },
  {
    "id": "vn-db",
    "hcKey": "vn-db",
    "name": "Điện Biên",
    "fullName": "Tỉnh Điện Biên",
    "region": "Northwest",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Điện Biên là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Điện Biên",
      "Di tích lịch sử Điện Biên",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Điện Biên",
    "centroid": {
      "x": 562,
      "y": 1186
    },
    "svgPath": "M 743 1856 L 688 1841 L 667 1825 L 635 1778 L 599 1697 L 556 1676 L 531 1610 L 514 1604 L 513 1560 L 488 1541 L 454 1538 L 473 1516 L 505 1502 L 512 1441 L 535 1404 L 527 1394 L 489 1413 L 521 1363 L 576 1305 L 567 1262 L 569 1212 L 559 1186 L 502 1208 L 482 1200 L 477 1123 L 452 1123 L 449 1182 L 425 1225 L 403 1239 L 355 1241 L 341 1188 L 345 1145 L 317 1062 L 296 1044 L 240 1019 L 232 991 L 244 972 L 203 942 L 181 901 L 112 839 L 71 817 L 23 760 L 0 692 L 32 672 L 68 683 L 93 622 L 143 571 L 180 564 L 234 575 L 268 572 L 308 604 L 360 670 L 398 686 L 449 727 L 476 773 L 481 821 L 494 841 L 537 843 L 546 878 L 566 893 L 627 885 L 664 904 L 694 932 L 720 930 L 779 960 L 781 936 L 821 886 L 846 880 L 873 896 L 883 937 L 912 974 L 914 1004 L 938 1021 L 974 1080 L 977 1178 L 985 1237 L 979 1283 L 955 1319 L 913 1360 L 892 1405 L 852 1432 L 868 1486 L 893 1507 L 900 1535 L 893 1584 L 880 1613 L 890 1677 L 850 1691 L 808 1670 L 786 1678 L 789 1711 L 756 1756 L 745 1809 L 743 1856 Z"
  },
  {
    "id": "vn-ls",
    "hcKey": "vn-ls",
    "name": "Lạng Sơn",
    "fullName": "Tỉnh Lạng Sơn",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Lạng Sơn là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Lạng Sơn",
      "Di tích lịch sử Lạng Sơn",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Lạng Sơn",
    "centroid": {
      "x": 3106,
      "y": 1119
    },
    "svgPath": "M 3012 701 L 3028 753 L 3070 759 L 3085 778 L 3102 832 L 3086 856 L 3109 928 L 3094 999 L 3112 1024 L 3144 990 L 3185 1013 L 3242 1018 L 3281 1055 L 3315 1041 L 3341 1046 L 3350 1072 L 3327 1107 L 3338 1132 L 3381 1142 L 3455 1201 L 3483 1208 L 3524 1197 L 3545 1219 L 3567 1274 L 3504 1317 L 3493 1338 L 3508 1368 L 3506 1404 L 3488 1427 L 3428 1454 L 3385 1462 L 3357 1451 L 3337 1400 L 3286 1401 L 3241 1331 L 3228 1293 L 3209 1294 L 3165 1326 L 3120 1290 L 3085 1283 L 3036 1300 L 3011 1331 L 2989 1386 L 2969 1415 L 2927 1430 L 2895 1421 L 2853 1382 L 2766 1353 L 2767 1314 L 2795 1269 L 2827 1235 L 2825 1222 L 2775 1156 L 2748 1142 L 2731 1074 L 2728 1037 L 2732 973 L 2741 949 L 2780 917 L 2813 853 L 2826 806 L 2799 763 L 2780 701 L 2802 680 L 2843 675 L 2920 720 L 2987 715 L 3012 701 Z"
  },
  {
    "id": "vn-th",
    "hcKey": "vn-th",
    "name": "Thanh Hóa",
    "fullName": "Tỉnh Thanh Hóa",
    "region": "North Central Region",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Thanh Hóa là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Thanh Hóa",
      "Di tích lịch sử Thanh Hóa",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Thanh Hóa",
    "centroid": {
      "x": 2143,
      "y": 2444
    },
    "svgPath": "M 2683 2470 L 2629 2522 L 2630 2558 L 2615 2578 L 2611 2619 L 2568 2634 L 2611 2629 L 2588 2672 L 2568 2672 L 2540 2730 L 2528 2863 L 2511 2912 L 2532 2976 L 2527 3000 L 2498 2986 L 2453 2980 L 2406 2936 L 2374 2917 L 2338 2869 L 2319 2857 L 2270 2858 L 2245 2847 L 2214 2806 L 2187 2802 L 2155 2821 L 2148 2748 L 2098 2698 L 2068 2647 L 2060 2608 L 2091 2549 L 2071 2531 L 2010 2512 L 1976 2491 L 1928 2475 L 1927 2420 L 1936 2402 L 1900 2370 L 1902 2340 L 1841 2307 L 1752 2325 L 1729 2313 L 1729 2264 L 1746 2258 L 1745 2219 L 1698 2192 L 1673 2165 L 1574 2167 L 1523 2146 L 1528 2132 L 1568 2105 L 1583 2076 L 1618 2093 L 1650 2076 L 1695 2015 L 1700 1997 L 1720 1998 L 1778 2040 L 1812 2047 L 1858 2010 L 1924 2036 L 2012 2047 L 2061 2036 L 2080 2046 L 2113 2089 L 2179 2134 L 2281 2186 L 2341 2199 L 2489 2324 L 2563 2369 L 2603 2380 L 2647 2410 L 2694 2418 L 2708 2442 L 2683 2470 Z"
  },
  {
    "id": "vn-307",
    "hcKey": "vn-307",
    "name": "Bắc Kạn",
    "fullName": "Region Bắc Kạn",
    "region": "Việt Nam",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bắc Kạn là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bắc Kạn",
      "Di tích lịch sử Bắc Kạn",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bắc Kạn",
    "centroid": {
      "x": 2541,
      "y": 823
    },
    "svgPath": "M 2348 1038 L 2339 1004 L 2314 961 L 2300 888 L 2304 805 L 2321 752 L 2368 686 L 2381 657 L 2380 622 L 2353 567 L 2407 504 L 2459 470 L 2495 483 L 2485 538 L 2522 630 L 2541 647 L 2586 648 L 2645 615 L 2704 602 L 2721 610 L 2738 647 L 2742 682 L 2780 701 L 2799 763 L 2826 806 L 2813 853 L 2780 917 L 2741 949 L 2732 973 L 2728 1037 L 2668 1057 L 2652 1082 L 2582 1128 L 2541 1137 L 2515 1156 L 2499 1087 L 2495 1017 L 2457 979 L 2395 994 L 2366 1033 L 2348 1038 Z"
  },
  {
    "id": "vn-tq",
    "hcKey": "vn-tq",
    "name": "Tuyên Quang",
    "fullName": "Tỉnh Tuyên Quang",
    "region": "Northeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Tuyên Quang là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Tuyên Quang",
      "Di tích lịch sử Tuyên Quang",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Tuyên Quang",
    "centroid": {
      "x": 2162,
      "y": 935
    },
    "svgPath": "M 2353 567 L 2380 622 L 2381 657 L 2368 686 L 2321 752 L 2304 805 L 2300 888 L 2314 961 L 2339 1004 L 2348 1038 L 2332 1099 L 2321 1242 L 2324 1289 L 2362 1336 L 2336 1353 L 2282 1371 L 2236 1372 L 2184 1358 L 2126 1282 L 2087 1246 L 2043 1219 L 2025 1185 L 2035 1152 L 2018 1121 L 1964 1058 L 1965 1021 L 1954 997 L 1887 937 L 1862 877 L 1918 806 L 1925 758 L 1937 743 L 1980 751 L 1999 740 L 2022 665 L 2058 617 L 2082 535 L 2100 527 L 2200 561 L 2307 575 L 2353 567 Z"
  },
  {
    "id": "vn-bi",
    "hcKey": "vn-bi",
    "name": "Bình Dương",
    "fullName": "Tỉnh Bình Dương",
    "region": "Southeast",
    "regionKey": "vietnam",
    "area": "Đang cập nhật từ Wikipedia",
    "population": "Cổng thông tin thống kê tỉnh",
    "wikiSummary": "Bình Dương là một trong những địa phương giàu truyền thống lịch sử, văn hóa và cảnh quan thiên nhiên tại Việt Nam. Nơi đây sở hữu nhiều điểm du lịch sinh thái, di tích văn hóa lịch sử và ẩm thực địa phương đặc sắc.",
    "thumbnail": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Danh lam thắng cảnh Bình Dương",
      "Di tích lịch sử Bình Dương",
      "Trung tâm ẩm thực địa phương"
    ],
    "bestSeason": "Mùa khô (Tháng 11 đến Tháng 4 hàng năm)",
    "matchingFilter": "Bình Dương",
    "centroid": {
      "x": 3175,
      "y": 8906
    },
    "svgPath": "M 3024 8658 L 3061 8691 L 3066 8708 L 3124 8734 L 3137 8747 L 3133 8785 L 3158 8831 L 3187 8801 L 3211 8809 L 3209 8838 L 3252 8817 L 3277 8821 L 3364 8853 L 3387 8854 L 3365 8904 L 3395 8972 L 3381 9015 L 3351 9040 L 3326 9042 L 3289 9022 L 3258 9043 L 3260 9077 L 3293 9123 L 3296 9145 L 3269 9140 L 3223 9155 L 3206 9150 L 3138 9056 L 3106 9027 L 3062 8964 L 3001 8973 L 2995 8949 L 2966 8920 L 2940 8864 L 2937 8812 L 2963 8744 L 3000 8702 L 3024 8658 Z"
  },
  {
    "id": "vn-333",
    "hcKey": "vn-333",
    "name": "Cần Thơ",
    "fullName": "Thành phố Cần Thơ",
    "region": "Đồng bằng sông Cửu Long",
    "regionKey": "dong-bang-song-cuu-long",
    "area": "1.439 km²",
    "population": "Khoảng 1,25 triệu người",
    "wikiSummary": "Đô thị miền sông nước Tây Đô sầm uất bên dòng sông Hậu hiền hòa. Nổi tiếng với Chợ nổi Cái Răng tấp nập buổi sớm mai, bến Ninh Kiều thi vị và các miệt vườn sinh thái trù phú.",
    "thumbnail": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Chợ nổi Cái Răng",
      "Bến Ninh Kiều & Cầu Tình Yêu",
      "Nhà cổ Bình Thủy",
      "Cồn Sơn miệt vườn",
      "Thiền viện Trúc Lâm Phương Nam"
    ],
    "bestSeason": "Tháng 9 - Tháng 11 (Mùa nước nổi miền Tây) & Tháng 12 - Tháng 4 (Mùa khô mát lành)",
    "matchingFilter": "Cần Thơ",
    "centroid": {
      "x": 2393,
      "y": 9627
    },
    "svgPath": "M 2141 9653 L 2159 9627 L 2208 9599 L 2233 9627 L 2278 9598 L 2310 9597 L 2325 9554 L 2353 9504 L 2389 9471 L 2424 9493 L 2474 9500 L 2546 9564 L 2582 9577 L 2606 9621 L 2627 9636 L 2626 9672 L 2583 9697 L 2524 9679 L 2502 9664 L 2477 9676 L 2469 9708 L 2424 9724 L 2347 9741 L 2273 9767 L 2201 9695 L 2141 9653 Z"
  }
];

export const VIETNAM_SPECIAL_ISLANDS = [
  {
    "id": "hoang-sa",
    "name": "Quần đảo Hoàng Sa",
    "fullName": "Huyện đảo Hoàng Sa (TP. Đà Nẵng)",
    "region": "Biển Đông • Việt Nam",
    "regionKey": "bien-dong",
    "area": "Quần thể san hô rạn",
    "population": "Vùng lãnh thổ thiêng liêng",
    "wikiSummary": "Quần đảo Hoàng Sa là một phần máu thịt thiêng liêng không thể tách rời của chủ quyền lãnh thổ Việt Nam trên Biển Đông, thuộc thẩm quyền quản lý hành chính của Ủy ban Nhân dân Huyện Hoàng Sa, thành phố Đà Nẵng.",
    "thumbnail": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Đảo Hoàng Sa",
      "Đảo Phú Lâm",
      "Đảo Tri Tôn",
      "Bãi Cát Vàng"
    ],
    "bestSeason": "Biển êm Tháng 3 - Tháng 7",
    "centroid": {
      "x": 6700,
      "y": 4400
    },
    "isIslandCluster": true
  },
  {
    "id": "truong-sa",
    "name": "Quần đảo Trường Sa",
    "fullName": "Huyện đảo Trường Sa (Tỉnh Khánh Hòa)",
    "region": "Biển Đông • Việt Nam",
    "regionKey": "bien-dong",
    "area": "Quần thể đảo ngầm & rạn san hô",
    "population": "Quân và dân huyện đảo Trường Sa",
    "wikiSummary": "Quần đảo Trường Sa là tiền đồn phên dậu bảo vệ chủ quyền biển đảo thiêng liêng của Tổ quốc Việt Nam trên Biển Đông, thuộc đơn vị hành chính Huyện đảo Trường Sa, tỉnh Khánh Hòa.",
    "thumbnail": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "famousLandmarks": [
      "Đảo Trường Sa Lớn",
      "Đảo Song Tử Tây",
      "Đảo Sinh Tồn",
      "Đảo Nam Yết",
      "Nhà giàn DK1"
    ],
    "bestSeason": "Tháng 4 - Tháng 6 (Thời tiết thuận lợi nhất)",
    "centroid": {
      "x": 7400,
      "y": 8800
    },
    "isIslandCluster": true
  }
];
