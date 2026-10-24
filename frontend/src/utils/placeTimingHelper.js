// ─────────────────────────────────────────────────────────────
// PLACE TIMING & BEST TIME TO VISIT HELPER
// Phân định rõ ràng:
// 1. Quán ăn, quán cafe: Phục vụ quanh năm, KHÔNG áp dụng mùa/tháng du lịch,
//    cung cấp khung giờ vàng thưởng thức và kinh nghiệm thực tế.
// 2. Địa điểm du lịch, di tích, thắng cảnh, thiên nhiên: Cung cấp cẩm nang mùa
//    lý tưởng, tháng nên đi, thời tiết và khung giờ chụp ảnh đẹp (VnExpress, Traveloka).
// ─────────────────────────────────────────────────────────────

export const isFoodOrCafePlace = (place) => {
  if (!place) return false;
  const category = (place.categoryName || '').toLowerCase();
  const name = (place.name || '').toLowerCase();

  // Kiểm tra danh mục trực tiếp
  if (
    category.includes('ẩm thực') ||
    category.includes('nhà hàng') ||
    category.includes('cà phê') ||
    category.includes('cafe') ||
    category.includes('coffee') ||
    category.includes('trà')
  ) {
    return true;
  }

  // Hoặc tên địa điểm là quán ăn, quán cà phê rõ rệt (loại trừ phố cổ, phố đi bộ)
  if (
    name.includes('phở ') ||
    name.includes('cà phê') ||
    name.includes('cafe') ||
    name.includes('caffe') ||
    name.includes('bánh mì') ||
    name.includes('cơm tấm') ||
    name.includes('quán ốc') ||
    name.includes('pizza') ||
    name.includes('bánh khọt') ||
    name.includes('bò tơ') ||
    name.includes('quán ăn') ||
    name.includes('nhà hàng')
  ) {
    if (name.includes('phố cổ') || name.includes('phố đi bộ') || name.includes('phố tây')) {
      return false;
    }
    return true;
  }

  return false;
};

export const getPlaceTimingDetails = (place) => {
  if (!place) return {
    isFoodOrCafe: false,
    hasSeasonalRecommendation: false,
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bestSeasonText: null,
    badgeText: '',
    idealTimeOfDay: 'Ban ngày',
    weatherTip: '',
    sourceCitation: ''
  };

  const name = (place.name || '').toLowerCase();
  const category = (place.categoryName || '').toLowerCase();
  const city = (place.address?.city || '').toLowerCase();
  const district = (place.address?.district || '').toLowerCase();

  // ─────────────────────────────────────────────────────────────
  // 1. ĐẶC BIỆT: ĐỐI VỚI QUÁN ĂN, NHÀ HÀNG & QUÁN CÀ PHÊ
  // Không áp dụng cẩm nang theo mùa hay theo tháng vì ẩm thực phục vụ quanh năm,
  // chỉ cung cấp khung giờ vàng thưởng thức và kinh nghiệm trải nghiệm thực tế!
  // ─────────────────────────────────────────────────────────────
  if (isFoodOrCafePlace(place)) {
    const isCoffee = category.includes('cà phê') || category.includes('cafe') || category.includes('coffee') || category.includes('trà') || name.includes('cafe') || name.includes('cà phê') || name.includes('caffe');

    if (name.includes('phở')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🍲 Phục vụ quanh năm • Thưởng thức mọi thời điểm',
        idealTimeOfDay: 'Sáng sớm (06:00 - 08:30) khi nước dùng sôi sùng sục, bánh phở tươi và thịt bò mềm ngọt nhất',
        practicalTip: 'Khung giờ trưa (11:30 - 13:00) và tối rất đông khách du lịch, nên đi sớm để có bàn ngồi thoáng mát.',
        sourceCitation: 'Kinh nghiệm ẩm thực thực tế & Cẩm nang Michelin Guide Selected',
        sourceUrl: 'https://guide.michelin.com'
      };
    }

    if (name.includes('bánh mì')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🥖 Phục vụ quanh năm • Bánh giòn mới ra lò',
        idealTimeOfDay: 'Đầu giờ chiều (13:30 - 15:30) khi quán vừa mở mẻ bánh mới giòn rụm, xếp hàng lấy bánh nhanh chóng',
        practicalTip: 'Khung giờ tan tầm (17:00 - 19:00) hàng chờ khá dài. Nếu ngại xếp hàng có thể đặt trước qua ứng dụng giao hàng.',
        sourceCitation: 'Thực khách Sài Gòn & Đánh giá Google Maps',
        sourceUrl: ''
      };
    }

    if (name.includes('cơm tấm')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🍚 Phục vụ quanh năm • Sườn nướng than hoa nóng hổi',
        idealTimeOfDay: 'Sáng (07:30 - 09:30) hoặc Trưa sớm (10:30 - 11:30) khi sườn nướng mẻ đầu thơm nức mũi',
        practicalTip: 'Miếng sườn nướng ở đây rất to và đậm đà. Đi trước 12:00 trưa để tránh hết bàn và không bị ám mùi khói nướng.',
        sourceCitation: 'Cẩm nang Michelin Bib Gourmand & Đánh giá thực khách',
        sourceUrl: 'https://guide.michelin.com'
      };
    }

    if (name.includes('quán ốc') || name.includes('ốc')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🐚 Phục vụ quanh năm • Hải sản tươi trong ngày',
        idealTimeOfDay: 'Chiều tối (16:30 - 19:00) khi nguồn ốc và hải sản tươi sống nhập về nguyên ngày, không khí nhộn nhịp',
        practicalTip: 'Nên đi nhóm 3-4 người để thưởng thức được nhiều loại ốc sốt trứng muối, bơ tỏi ăn kèm bánh mì nóng giòn.',
        sourceCitation: 'Đánh giá ẩm thực đường phố Sài Gòn',
        sourceUrl: ''
      };
    }

    if (name.includes('bánh khọt')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🍤 Phục vụ quanh năm • Bánh khọt tôm tươi giòn rụm',
        idealTimeOfDay: 'Sáng điểm tâm (07:00 - 09:30) hoặc Xế chiều (15:00 - 17:30) khi chảo chiên bánh xèo xèo vàng ươm',
        practicalTip: 'Cuộn bánh khọt với rau xà lách, lá cải xanh và đồ chua, chấm đẫm nước mắm chua ngọt pha chuẩn vị miền biển.',
        sourceCitation: 'Ẩm thực Vũng Tàu & Đánh giá thực khách địa phương',
        sourceUrl: ''
      };
    }

    if (name.includes('bò tơ')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🥩 Phục vụ quanh năm • Bò tơ nướng than thơm lừng',
        idealTimeOfDay: 'Trưa (11:00 - 13:30) hoặc Chiều tối (17:00 - 20:30) lai rai cùng gia đình, bạn bè',
        practicalTip: 'Bò tơ cuốn bánh tráng phơi sương Trảng Bàng chấm mắm nêm là món đặc trưng không thể bỏ qua.',
        sourceCitation: 'Đặc sản Tây Ninh & Trải nghiệm thực khách',
        sourceUrl: ''
      };
    }

    if (name.includes('pizza')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '🍕 Phục vụ quanh năm • Nướng củi phô mai tươi',
        idealTimeOfDay: 'Buổi trưa (11:30 - 13:30) hoặc Tối (18:00 - 20:30) không gian ấm cúng, thích hợp gặp gỡ bạn bè, gia đình',
        practicalTip: 'Nên đặt bàn trước qua hotline hoặc website trước 1-2 ngày, đặc biệt vào tối cuối tuần để có vị trí ngồi đẹp.',
        sourceCitation: 'Cộng đồng ẩm thực & Thực khách Google Reviews',
        sourceUrl: ''
      };
    }

    if (name.includes('vợt')) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '☕ Mở cửa 24/7 quanh năm • Cà phê vợt truyền thống',
        idealTimeOfDay: 'Sáng sớm tinh mơ (05:00 - 07:00) hoặc Đêm muộn (22:00 - 01:00) cảm nhận nét bình dị đặc trưng của Sài Gòn',
        practicalTip: 'Quán mở cửa xuyên suốt 24/7, ngồi ghế cóc ven hẻm bình dân. Uống ly cà phê sữa đá hoặc bạc xỉu thơm ngậy vị sữa.',
        sourceCitation: 'Ký sự Sài Gòn & Di sản văn hóa ẩm thực đường phố',
        sourceUrl: ''
      };
    }

    if (isCoffee) {
      return {
        isFoodOrCafe: true,
        hasSeasonalRecommendation: false,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestSeasonText: null,
        badgeText: '☕ Phục vụ quanh năm • Thư giãn mọi thời điểm',
        idealTimeOfDay: 'Sáng sớm (07:30 - 09:30) không gian yên tĩnh đọc sách, làm việc hoặc Chiều tối (17:30 - 21:00) gặp gỡ bạn bè',
        practicalTip: 'Quán phục vụ quanh năm, có không gian máy lạnh và góc sân vườn thoáng mát. Giờ cao điểm cuối tuần thường kín bàn.',
        sourceCitation: 'Cộng đồng Cà phê & Đánh giá thực tế từ Google Maps',
        sourceUrl: ''
      };
    }

    // Quán ăn & Nhà hàng chung
    return {
      isFoodOrCafe: true,
      hasSeasonalRecommendation: false,
      bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      bestSeasonText: null,
      badgeText: '🍲 Phục vụ quanh năm • Thưởng thức mọi thời điểm',
      idealTimeOfDay: 'Bữa trưa (11:00 - 13:00) hoặc Bữa tối (17:30 - 20:30) thưởng thức món ăn nóng hổi trọn vị',
      practicalTip: 'Quán phục vụ đều đặn tất cả các ngày trong năm, không phụ thuộc vào mùa thời tiết. Nên liên hệ trước nếu đi nhóm đông.',
      sourceCitation: 'Kinh nghiệm thực khách & Hướng dẫn ẩm thực địa phương',
      sourceUrl: ''
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 2. CÁC ĐỊA ĐIỂM DU LỊCH, DI TÍCH, THẮNG CẢNH, THIÊN NHIÊN
  // (Áp dụng cẩm nang mùa, tháng và thời tiết đối soát chính thức)
  // ─────────────────────────────────────────────────────────────
  const getTourismDetails = () => {
    // 1. Hà Nội
  if (city.includes('hà nội') || district.includes('hoàn kiếm') || district.includes('ba đình') || name.includes('hồ gươm') || name.includes('văn miếu') || name.includes('thăng long')) {
    return {
      isFoodOrCafe: false,
      hasSeasonalRecommendation: true,
      bestMonths: [9, 10, 11, 1, 2, 3],
      bestSeasonText: 'Mùa thu Hà Nội (Tháng 9 - 11) & Mùa xuân trẩy hội (Tháng 1 - 3)',
      badgeText: '🗓️ Mùa thu Hà Nội (Tháng 9 - 11) & Mùa xuân (Tháng 1 - 3)',
      idealTimeOfDay: 'Sáng sớm (06:30 - 09:00) đón sương bảng lảng quanh Hồ Gươm hoặc Chiều thu (15:30 - 18:00)',
      weatherTip: 'Mùa thu thời tiết se lạnh mát mẻ, nắng vàng hanh hao, hoa sữa thơm nồng. Tháng 5 - 8 oi bức và có thể có mưa dông.',
      sourceCitation: 'Sở Du lịch Hà Nội & Cẩm nang du lịch Báo VnExpress',
      sourceUrl: 'https://hanoitourist.gov.vn'
    };
  }

  // 2. Đà Nẵng
  if (city.includes('đà nẵng') || district.includes('sơn trà') || district.includes('ngũ hành sơn') || name.includes('bà nà') || name.includes('cầu vàng') || name.includes('mỹ khê') || name.includes('cầu rồng')) {
    return {
      bestMonths: [3, 4, 5, 6, 7, 8],
      bestSeasonText: 'Mùa khô biển êm, trời trong xanh (Tháng 3 - Tháng 8)',
      idealTimeOfDay: 'Bà Nà Hills nên đi sớm (07:30 - 11:00) ngắm mây; Bãi biển Mỹ Khê tắm sớm (05:30 - 07:30) hoặc Cầu Rồng tối cuối tuần (20:30)',
      weatherTip: 'Tránh đi vào mùa mưa bão cao điểm miền Trung (Tháng 9 đến Tháng 11). Mùa hè nắng đẹp lý tưởng cho lễ hội pháo hoa quốc tế DIFF.',
      sourceCitation: 'Trung tâm Xúc tiến Du lịch Đà Nẵng (Danang Fantasticity)',
      sourceUrl: 'https://danangfantasticity.com'
    };
  }

  // 3. Quảng Nam / Hội An
  if (city.includes('quảng nam') || district.includes('hội an') || name.includes('hội an') || name.includes('chùa cầu') || name.includes('mỹ sơn')) {
    return {
      bestMonths: [2, 3, 4, 5, 6, 7, 8],
      bestSeasonText: 'Mùa khô ráo, nắng ấm chan hòa (Tháng 2 - Tháng 8)',
      idealTimeOfDay: 'Sáng sớm (06:30 - 08:30) chụp ảnh phố cổ vắng người, hoặc Chiều tối (17:30 - 21:00) thả hoa đăng ngắm đèn lồng',
      weatherTip: 'Đặc biệt nên đi vào ngày Rằm 14-15 âm lịch hàng tháng để thưởng ngoạn đêm phố cổ tắt đèn điện lung linh. Tháng 10-11 hay có mưa lụt sông Hoài.',
      sourceCitation: 'Trung tâm Văn hóa Thể thao & Du lịch TP. Hội An',
      sourceUrl: 'https://hoianworldheritage.org.vn'
    };
  }

  // 4. Thừa Thiên Huế
  if (city.includes('huế') || name.includes('đại nội') || name.includes('thiên mụ') || name.includes('khải định') || name.includes('tự đức')) {
    return {
      bestMonths: [1, 2, 3, 4, 5],
      bestSeasonText: 'Mùa xuân cố đô se lạnh, mát mẻ (Tháng 1 - Tháng 5)',
      idealTimeOfDay: 'Buổi sáng (08:00 - 11:00) tham quan Đại Nội, Hoàng hôn (16:30 - 18:30) ngắm sông Hương chùa Thiên Mụ',
      weatherTip: 'Tháng 9 đến tháng 11 là cao điểm mưa dầm xứ Huế. Đi đầu năm thời tiết khô ráo, hoa ngô đồng nở rộ rất cổ kính.',
      sourceCitation: 'Trung tâm Bảo tồn Di tích Cố đô Huế & Traveloka 2026',
      sourceUrl: 'https://hueworldheritage.org.vn'
    };
  }

  // 5. Quảng Ninh / Hạ Long
  if (city.includes('quảng ninh') || name.includes('hạ long') || name.includes('yên tử') || name.includes('cô tô') || name.includes('tuần châu')) {
    return {
      bestMonths: [4, 5, 6, 9, 10, 11],
      bestSeasonText: 'Đầu hè biển lặng (Tháng 4 - 6) & Mùa thu trời trong xanh (Tháng 9 - 11)',
      idealTimeOfDay: 'Sáng sớm du thuyền lướt sóng ngắm bình minh trên vịnh hoặc Chiều tà chèo kayak hang Luồn',
      weatherTip: 'Tháng 7 - 8 có thể có bão nhiệt đới gây cấm biển tạm thời. Mùa thu tháng 9-11 biển êm phẳng lặng, rất ít mưa.',
      sourceCitation: 'Ban Quản lý Vịnh Hạ Long & Tổng cục Du lịch Việt Nam',
      sourceUrl: 'https://halongbay.com.vn'
    };
  }

  // 6. Ninh Bình
  if (city.includes('ninh bình') || name.includes('tràng an') || name.includes('bái đính') || name.includes('tam cốc') || name.includes('hang múa')) {
    return {
      bestMonths: [1, 2, 3, 5, 6, 9, 10],
      bestSeasonText: 'Lễ hội đầu xuân (Tháng 1 - 3) & Mùa lúa chín vàng Tam Cốc (Tháng 5 - 6)',
      idealTimeOfDay: 'Sáng sớm (07:30 - 10:30) chèo thuyền Tràng An mát mẻ hoặc Chiều muộn (16:30 - 18:00) đón hoàng hôn Hang Múa',
      weatherTip: 'Tháng 5 và tháng 6 là thời điểm vàng ngắm thảm lúa vàng rực hai bên sông Ngô Đồng. Chuẩn bị nón lá và áo phao khi đi thuyền.',
      sourceCitation: 'Sở Du lịch Tỉnh Ninh Bình & Di sản Tràng An',
      sourceUrl: 'https://dulichninhbinh.com.vn'
    };
  }

  // 7. Lào Cai / Sa Pa
  if (city.includes('lào cai') || name.includes('fansipan') || name.includes('sa pa') || name.includes('cát cát') || name.includes('ô quy hồ')) {
    return {
      bestMonths: [9, 10, 11, 12, 1, 2],
      bestSeasonText: 'Mùa lúa chín vàng óng (Tháng 9 - 10) & Mùa săn mây, tuyết rơi (Tháng 11 - 2)',
      idealTimeOfDay: 'Sáng sớm (08:00 - 11:00) cáp treo lên đỉnh Fansipan biển mây bồng bềnh, Chiều hoàng hôn đèo Ô Quy Hồ',
      weatherTip: 'Tháng 7 - 8 có nguy cơ mưa lớn sạt lở đèo núi nên tránh. Mùa đông trên đỉnh nhiệt độ có thể xuống dưới 0°C, cần áo phao ấm và găng tay.',
      sourceCitation: 'Cổng thông tin Du lịch Sa Pa & Báo VnExpress',
      sourceUrl: 'https://dulichsapa.gov.vn'
    };
  }

  // 8. Hà Giang
  if (city.includes('hà giang') || name.includes('mã pí lèng') || name.includes('nho quế') || name.includes('lũng cú') || name.includes('đồng văn')) {
    return {
      bestMonths: [9, 10, 11, 12, 1, 2],
      bestSeasonText: 'Mùa lúa chín Hoàng Su Phì (Tháng 9) & Mùa hoa tam giác mạch (Tháng 10 - 12)',
      idealTimeOfDay: 'Sáng 08:00 - 11:30 đi thuyền hẻm Tu Sản sông Nho Quế, Chiều 15:00 - 17:30 ngắm đèo Mã Pí Lèng',
      weatherTip: 'Đường đèo dốc quanh co hiểm trở, cần tay lái vững hoặc thuê xe ôm bản địa. Đêm cao nguyên đá rất lạnh, cần trang bị áo ấm dày.',
      sourceCitation: 'Hiệp hội Du lịch Hà Giang & UNESCO Global Geopark',
      sourceUrl: 'https://hagiangtourist.vn'
    };
  }

  // 9. Lâm Đồng / Đà Lạt
  if (city.includes('lâm đồng') || district.includes('đà lạt') || name.includes('đà lạt') || name.includes('langbiang') || name.includes('datanla') || name.includes('xuân hương')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4],
      bestSeasonText: 'Mùa khô se lạnh, hoa mai anh đào & dã quỳ nở rộ (Tháng 11 - Tháng 4)',
      idealTimeOfDay: 'Sáng sớm (05:30 - 08:30) săn mây đồi chè Cầu Đất, Chiều tối (17:30 - 21:30) dạo chợ đêm uống sữa đậu nóng',
      weatherTip: 'Nhiệt độ ngày và đêm chênh lệch lớn (12°C - 24°C). Luôn chuẩn bị áo khoác len, khăn choàng khi ra đường vào buổi tối.',
      sourceCitation: 'Sở VHTTDL Tỉnh Lâm Đồng & Cẩm nang du lịch Đà Lạt',
      sourceUrl: 'https://lamdong.gov.vn'
    };
  }

  // 10. Khánh Hòa / Nha Trang
  if (city.includes('khánh hòa') || district.includes('nha trang') || name.includes('nha trang') || name.includes('ponagar') || name.includes('hòn tre') || name.includes('vinwonders')) {
    return {
      bestMonths: [1, 2, 3, 4, 5, 6, 7, 8],
      bestSeasonText: 'Mùa khô nắng ấm, biển xanh trong vắt (Tháng 1 - Tháng 8)',
      idealTimeOfDay: 'Sáng (07:30 - 11:30) tham quan tháp cổ hoặc đi tour các đảo ngắm san hô; Chiều tối (17:00 - 21:30) phố biển',
      weatherTip: 'Tránh các tháng cuối năm (tháng 10-11) có mưa dầm. Mùa hè từ tháng 3 đến tháng 8 là thiên đường lặn biển biển êm.',
      sourceCitation: 'Cổng thông tin Du lịch Khánh Hòa (Nha Trang Tourism)',
      sourceUrl: 'https://nhatrang-travel.com'
    };
  }

  // 11. Kiên Giang / Phú Quốc
  if (city.includes('kiên giang') || district.includes('phú quốc') || name.includes('phú quốc') || name.includes('bãi sao') || name.includes('hòn thơm') || name.includes('grand world')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4],
      bestSeasonText: 'Mùa khô biển êm phẳng lặng, nắng vàng rực rỡ (Tháng 11 - Tháng 4)',
      idealTimeOfDay: 'Sáng (08:00 - 11:30) tắm biển Bãi Sao hoặc đi cáp treo Hòn Thơm; Hoàng hôn (17:00 - 18:30) ngắm mặt trời lặn vịnh Thái Lan',
      weatherTip: 'Mùa mưa Phú Quốc từ tháng 6 đến tháng 9 sóng lớn ở bãi Dài. Mùa khô bãi Sao và các đảo Nam Phú Quốc phẳng lặng như mặt gương.',
      sourceCitation: 'Trung tâm Xúc tiến Du lịch Kiên Giang & Traveloka 2026',
      sourceUrl: 'https://kiengiang.gov.vn'
    };
  }

  // 12. Bình Thuận / Mũi Né
  if (city.includes('bình thuận') || district.includes('phan thiết') || name.includes('mũi né') || name.includes('đồi cát') || name.includes('bàu trắng')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4, 5],
      bestSeasonText: 'Mùa khô lộng gió, biển xanh cát trắng (Tháng 11 - Tháng 5)',
      idealTimeOfDay: 'Sáng sớm (05:30 - 07:30) ngắm bình minh đồi cát, hoặc Chiều mát (16:00 - 18:00) trượt cát không bị rát chân',
      weatherTip: 'Buổi trưa sa mạc cát hấp thụ nhiệt rất nóng, nên chuẩn bị kính râm, khăn choàng chống cát và nước khoáng.',
      sourceCitation: 'Hiệp hội Du lịch Bình Thuận & Báo Du lịch',
      sourceUrl: 'https://dulichbinhthuan.com.vn'
    };
  }

  // 13. Cần Thơ / Miền Tây
  if (city.includes('cần thơ') || name.includes('cái răng') || name.includes('ninh kiều') || name.includes('bình thủy')) {
    return {
      bestMonths: [9, 10, 11, 12, 1, 2, 3, 4],
      bestSeasonText: 'Mùa nước nổi bội thu (Tháng 9 - 11) & Mùa xuân mát lành (Tháng 12 - 4)',
      idealTimeOfDay: 'Sáng sớm bình minh (05:00 - 07:30) đi chợ nổi Cái Răng, Chiều tối (18:30 - 21:30) dạo bến Ninh Kiều',
      weatherTip: 'Đi chợ nổi bắt buộc dậy sớm từ 5h sáng để cảm nhận hết sự tấp nập giao thương của thuyền bè.',
      sourceCitation: 'Cổng thông tin Du lịch TP. Cần Thơ',
      sourceUrl: 'https://canthotourism.vn'
    };
  }

  // 14. Tây Ninh / Núi Bà Đen
  if (city.includes('tây ninh') || district.includes('tây ninh') || name.includes('bà đen') || name.includes('tòa thánh') || name.includes('dầu tiếng')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4, 5],
      bestSeasonText: 'Mùa khô & Hội xuân đầu năm (Tháng 11 - Tháng 5)',
      idealTimeOfDay: 'Sáng sớm (06:30 - 09:30) đón mây hoặc Hoàng hôn (16:30 - 19:30) ngắm đèn chùa',
      weatherTip: 'Trưa nắng gắt trên đỉnh núi, cần mũ rộng vành, kem chống nắng. Chiều tối nhiệt độ hạ nhanh, nên mang áo khoác nhẹ.',
      sourceCitation: 'Sở VHTTDL Tỉnh Tây Ninh & Cẩm nang du lịch Sun World Ba Den',
      sourceUrl: 'https://dulich.tayninh.gov.vn'
    };
  }

  // 15. Vũng Tàu / Côn Đảo
  if (city.includes('vũng tàu') || city.includes('bà rịa') || district.includes('vũng tàu') || name.includes('hải đăng') || name.includes('chúa kytô') || name.includes('nghinh phong') || name.includes('bãi sau')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4, 5],
      bestSeasonText: 'Mùa khô biển êm, sóng lặng (Tháng 11 - Tháng 5)',
      idealTimeOfDay: 'Sáng sớm (06:00 - 08:30) tắm biển hoặc Chiều tà (16:30 - 18:30) ngắm hoàng hôn ngọn hải đăng',
      weatherTip: 'Tránh các đợt áp thấp nhiệt đới tháng 9-10. Cuối tuần thường đông đúc, nên đi ngày trong tuần để có trải nghiệm trọn vẹn.',
      sourceCitation: 'Cổng thông tin Du lịch Bà Rịa - Vũng Tàu & Báo VnExpress',
      sourceUrl: 'https://baria-vungtau.gov.vn'
    };
  }

  // 16. Tiền Giang / Bến Tre
  if (city.includes('tiền giang') || city.includes('bến tre') || district.includes('tiền giang') || district.includes('mỹ tho') || name.includes('thới sơn') || name.includes('vĩnh tràng') || name.includes('đồng tâm')) {
    return {
      bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      bestSeasonText: 'Mùa trái cây miệt vườn rộ (Tháng 5 - 9) & Du xuân sông nước (Tháng 1 - 4)',
      idealTimeOfDay: 'Sáng sớm (07:00 - 10:00) khi chợ nổi tấp nập và nắng còn dịu mát trên sông',
      weatherTip: 'Nên đi thuyền có mái che hoặc trang bị nón lá, áo phao. Chuẩn bị thuốc chống côn trùng khi vào vườn cây ăn trái.',
      sourceCitation: 'Trung tâm Xúc tiến Du lịch Tiền Giang & Cẩm nang sông nước Mekong',
      sourceUrl: 'https://dulichtiengiang.gov.vn'
    };
  }

  // 17. Cần Giờ / Rừng Sác
  if (district.includes('cần giờ') || name.includes('rừng sác') || name.includes('khỉ') || name.includes('thạnh an')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4],
      bestSeasonText: 'Mùa khô nắng ấm, gió biển trong lành (Tháng 11 - Tháng 4)',
      idealTimeOfDay: 'Buổi sáng (08:00 - 11:30) cano len lỏi rừng ngập mặn khi thủy triều thuận lợi',
      weatherTip: 'Chú ý cất giữ kính mắt và điện thoại cẩn thận trước đàn khỉ tinh nghịch. Nên xịt chống muỗi trước khi vào rừng ngập mặn.',
      sourceCitation: 'Ban Quản lý Rừng phòng hộ Cần Giờ & Sở Du lịch TP.HCM',
      sourceUrl: 'https://visithcmc.vn'
    };
  }

  // 18. Củ Chi / Địa đạo
  if (district.includes('củ chi') || name.includes('địa đạo')) {
    return {
      bestMonths: [11, 12, 1, 2, 3, 4],
      bestSeasonText: 'Mùa khô mát mẻ, lòng hầm khô ráo dễ di chuyển (Tháng 11 - Tháng 4)',
      idealTimeOfDay: 'Sáng sớm (07:30 - 11:00) tránh cái nóng gay gắt buổi trưa',
      weatherTip: 'Mặc trang phục gọn gàng, giày thể thao bám tốt để bò hầm. Người có tiền sử hô hấp hay sợ không gian kín nên cân nhắc trước khi xuống hầm sâu.',
      sourceCitation: 'Khu Di tích Lịch sử Địa đạo Củ Chi & VnExpress Du lịch',
      sourceUrl: 'https://diadaocuchi.com.vn'
    };
  }

  // 19. Mặc định chung cho TP.HCM & Nam Bộ
    return {
      bestMonths: [11, 12, 1, 2, 3, 4],
      bestSeasonText: 'Mùa khô phương Nam, trời trong xanh không mưa (Tháng 11 - Tháng 4)',
      idealTimeOfDay: 'Sáng mát (08:00 - 10:30) hoặc Chiều hoàng hôn (16:30 - 21:00)',
      weatherTip: 'Nếu đi vào mùa mưa (tháng 5-10), nên đem theo ô dù nhỏ, mưa rào thường diễn ra ngắn khoảng 30-45 phút vào chiều tối.',
      sourceCitation: 'Cổng thông tin Du lịch TP.HCM (visithcmc.vn) & Vietnam Tourism',
      sourceUrl: 'https://visithcmc.vn'
    };
  };

  const res = getTourismDetails();
  return {
    isFoodOrCafe: false,
    hasSeasonalRecommendation: true,
    badgeText: res.badgeText || `🗓️ ${res.bestSeasonText}`,
    ...res
  };
};
