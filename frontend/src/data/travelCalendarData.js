// ─────────────────────────────────────────────────────────────
// TRAVEL CALENDAR 2026 & VIETNAM PROVINCES INTELLIGENCE REGISTRY
// Nguồn đối soát: Traveloka Cẩm nang du lịch 2026, Wikipedia Tiếng Việt,
// Cổng Thông tin Tổng cục Du lịch Việt Nam, VnExpress Du lịch.
// ─────────────────────────────────────────────────────────────

export const TRAVEL_CALENDAR_2026 = [
  {
    month: 1,
    title: 'Tháng 1 - Mùa Lễ Hội, Mùa Hoa Rực Rỡ & Nắng Ấm Phương Nam',
    seasonName: 'Đầu Xuân / Mùa khô phương Nam & Mùa săn mây phương Bắc',
    generalAdvice: 'Thời tiết miền Bắc rét ngọt khô ráo, săn mây Sa Pa, hoa mận Mộc Châu nở rực. Miền Nam và các đảo ngọc bước vào mùa khô biển êm đẹp nhất năm; riêng miền Trung còn mưa dầm lạnh.',
    destinations: [
      {
        region: 'Lào Cai (Sa Pa, Fansipan)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Lạnh & khô ráo 5-10°C, hoa đào, hoa mận chớm nở, biển mây bồng bềnh trên đỉnh Fansipan và đèo Ô Quy Hồ.',
        source: 'Traveloka Cẩm nang 2026 & TTXTDL Lào Cai',
        tags: ['Săn mây', 'Hoa đào', 'Hoa mận', 'Se lạnh']
      },
      {
        region: 'Hà Giang (Đồng Văn, Mèo Vạc)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Hoa mơ, hoa mận, hoa đào và hoa cải vàng rực rỡ khắp các thung lũng Sủng Là, Quản Bạ; sông Nho Quế xanh ngắt.',
        source: 'VnExpress Du Lịch & Cổng TTĐT Hà Giang',
        tags: ['Mùa hoa cải', 'Cao nguyên đá', 'Sông Nho Quế']
      },
      {
        region: 'Sơn La (Cao nguyên Mộc Châu)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thung lũng mận Nà Ka và Mu Náu nở hoa trắng xóa bạt ngàn sườn đồi, đồi chè xanh mướt mát lạnh.',
        source: 'Cổng TT Du lịch Sơn La',
        tags: ['Mận trắng Mộc Châu', 'Thung lũng Nà Ka', 'Đồi chè']
      },
      {
        region: 'Tây Nguyên (Đà Lạt & Đắk Lắk)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa mai anh đào nhuộm hồng rực rỡ các cung đường dốc Đà Lạt, trời se lạnh nắng vàng hanh hao 14-22°C.',
        source: 'Sở VHTTDL Lâm Đồng',
        tags: ['Mai anh đào', 'Đà Lạt se lạnh', 'Cà phê hoa']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa khô nắng vàng rực rỡ, gió mát mẻ 22-31°C. Chuẩn bị đón Tết Nguyên đán, dạo phố hoa và hành hương Núi Bà Đen.',
        source: 'Cổng TT Du lịch TP.HCM & Sun World Ba Den',
        tags: ['Thời tiết khô ráo', 'Hành hương', 'Check-in phố hoa']
      },
      {
        region: 'Bà Rịa - Vũng Tàu & Cần Giờ',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển êm sóng nhẹ, nắng ấm chan hòa, mùa hoa đỗ mai phớt hồng nở rực đường lên ngọn Hải Đăng Vũng Tàu.',
        source: 'Cổng TT Du lịch Vũng Tàu',
        tags: ['Biển êm', 'Hoa đỗ mai', 'Hải đăng Vũng Tàu']
      },
      {
        region: 'Kiên Giang (Phú Quốc & Quần đảo Nam Du)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thời điểm đẹp nhất trong năm của đảo ngọc Phú Quốc. Biển êm như gương, nước ngọc bích, lặn ngắm san hô Bãi Sao.',
        source: 'Traveloka & Zing News Du Lịch',
        tags: ['Biển êm như gương', 'Lặn san hô', 'Mùa khô hoàn hảo']
      },
      {
        region: 'ĐBSCL (Sa Đéc, Cần Thơ, Bến Tre)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Làng hoa Sa Đéc rực rỡ muôn sắc thắm vào chính vụ Tết, chợ nổi Cái Răng tấp nập thuyền hoa trái rực rỡ sông nước.',
        source: 'Sở VHTTDL Đồng Tháp & Cần Thơ',
        tags: ['Làng hoa Sa Đéc', 'Chợ nổi Tết', 'Du lịch miệt vườn']
      },
      {
        region: 'Hà Nội & Ninh Bình',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Trời rét ngọt 13-17°C, có sương mù ẩm nhẹ buổi sáng. Thích hợp vãn cảnh chùa Hương và chuẩn bị du xuân Bái Đính.',
        source: 'Báo Du Lịch Việt Nam',
        tags: ['Rét ngọt', 'Sương mù sáng', 'Du xuân đầu năm']
      },
      {
        region: 'Quảng Ninh (Vịnh Hạ Long, Yên Tử)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết lạnh và sương mù dày bao phủ mặt vịnh, cảnh sắc huyền bí tĩnh lặng nhưng không thích hợp tắm biển.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Vịnh sương mờ', 'Du thuyền tĩnh lặng', 'Không tắm biển']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Mũi Né)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết chuyển mùa, lượng mưa giảm nhiều nhưng thỉnh thoảng còn gió chướng mạnh, sóng biển hơi lớn.',
        source: 'Sở Du lịch Khánh Hòa',
        tags: ['Gió chướng', 'Sóng biển vừa', 'Nắng ấm dần']
      },
      {
        region: 'Bắc Trung Bộ & Huế, Đà Nẵng',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Gió mùa Đông Bắc mang mưa phùn lạnh giá kéo dài, biển Đà Nẵng sóng to gió lớn cấm tắm biển, Huế mưa dầm buốt giá 16-19°C.',
        source: 'Đài Khí tượng Miền Trung & TTXTDL Đà Nẵng',
        tags: ['Mưa phùn lạnh', 'Biển động sóng lớn', 'Cấm tắm biển']
      }
    ]
  },
  {
    month: 2,
    title: 'Tháng 2 - Du Xuân Trẩy Hội, Rực Rỡ Hoa Tết & Biển Nắng Miền Trung',
    seasonName: 'Mùa Lễ hội xuân & Trẩy hội chùa chiền ba miền',
    generalAdvice: 'Tháng cao điểm du xuân khắp ba miền. Miền Bắc ngập tràn lễ hội văn hóa dân gian, miền Trung khô ráo biển êm trở lại, miền Nam ấm áp rực rỡ.',
    destinations: [
      {
        region: 'Ninh Bình (Tràng An, Bái Đính)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khai hội Chùa Bái Đính lớn nhất miền Bắc, ngồi thuyền nan vãn cảnh Tràng An trong tiết trời xuân non xanh thanh tịnh.',
        source: 'Traveloka 2026 & Ban quản lý Danh thắng Tràng An',
        tags: ['Lễ hội Bái Đính', 'Thuyền Tràng An', 'Du xuân cầu an']
      },
      {
        region: 'Tây Ninh (Quần thể Núi Bà Đen)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Hội xuân Núi Bà Đen linh thiêng, chiêm bái tượng Phật Bà Tây Bổ Đà Sơn trong sương sớm và biển hoa ngút ngàn đỉnh núi.',
        source: 'Sở VHTTDL Tỉnh Tây Ninh',
        tags: ['Hội xuân Núi Bà', 'Cáp treo ngắm mây', 'Chiêm bái cầu may']
      },
      {
        region: 'Lào Cai & Mộc Châu (Sơn La)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Hoa đào, hoa mận nở trắng rừng Tây Bắc, lễ hội Gầu Tào đầu năm náo nức trên các bản làng người Mông, Dao.',
        source: 'Traveloka 2026',
        tags: ['Hoa mận trắng rừng', 'Lễ hội bản làng', 'Săn mây Fansipan']
      },
      {
        region: 'Tây Nguyên (Đà Lạt & Kon Tum)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thời tiết Đà Lạt tuyệt đỉnh 14-22°C, hoa mai anh đào nở rộ cùng hoa ban trắng, lễ hội nhà rông Kon Tum.',
        source: 'Sở VHTTDL Lâm Đồng',
        tags: ['Hoa ban trắng', 'Mai anh đào đỉnh cao', 'Trời se lạnh']
      },
      {
        region: 'Đà Nẵng & Hội An (Quảng Nam)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Trời khô ráo mát mẻ, nắng nhẹ, biển êm, thả đèn hoa đăng lung linh trên sông Hoài đêm rằm đầu năm.',
        source: 'Traveloka 2026 & TTXTDL Quảng Nam',
        tags: ['Trời khô mát', 'Thả hoa đăng', 'Biển êm']
      },
      {
        region: 'Thừa Thiên Huế',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khô ráo, se lạnh dịu dàng, ngắm hoàng hôn đỏ ối trên phá Tam Giang và viếng thăm Đại Nội, cổ tự Thiên Mụ.',
        source: 'Traveloka 2026 & Trung tâm Bảo tồn Di tích Cố đô Huế',
        tags: ['Hoàng hôn Tam Giang', 'Cố đô thanh bình', 'Viếng chùa đầu năm']
      },
      {
        region: 'TP. Hồ Chí Minh & Bà Rịa - Vũng Tàu',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nắng ấm chan hòa, không khí Tết nhộn nhịp, đường hoa Nguyễn Huệ, tắm biển Bãi Sau sóng nhẹ trong lành.',
        source: 'Cổng TT Du lịch TP.HCM & Vũng Tàu',
        tags: ['Đường hoa Tết', 'Tắm biển Bãi Sau', 'Thời tiết lý tưởng']
      },
      {
        region: 'Kiên Giang (Phú Quốc & Hòn Thơm)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa khô hoàn hảo, nắng vàng rực rỡ, lặn ngắm san hô Bãi Khem, ngắm hoàng hôn Sunset Sanato đỉnh cao.',
        source: 'Traveloka 2026',
        tags: ['Nắng rực rỡ', 'Cáp treo Hòn Thơm', 'Lặn biển']
      },
      {
        region: 'ĐBSCL (Châu Đốc, Cần Thơ, Tiền Giang)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Lễ hội Vía Bà Chúa Xứ Núi Sam Châu Đốc linh thiêng đầu năm, du ngoạn cù lao miệt vườn sông nước.',
        source: 'Sở Du lịch An Giang & Cần Thơ',
        tags: ['Miếu Bà Chúa Xứ', 'Du lịch tâm linh', 'Cù lao sông nước']
      },
      {
        region: 'Hà Nội & Vùng Đồng bằng Sông Hồng',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mưa xuân, mưa phùn đặc trưng miền Bắc khiến đường phố ẩm ướt, thích hợp du xuân đền chùa hơn là ngắm cảnh ngoài trời.',
        source: 'Báo Du Lịch Việt Nam',
        tags: ['Mưa phùn xuân', 'Không khí Tết cổ truyền']
      },
      {
        region: 'Quảng Ninh (Hạ Long, Yên Tử)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Lễ hội xuân Yên Tử đông đúc linh thiêng, nhiệt độ vịnh biển 16-20°C còn se lạnh, chưa thích hợp tắm biển.',
        source: 'Cổng TT Du lịch Quảng Ninh',
        tags: ['Lễ hội Yên Tử', 'Se lạnh', 'Chưa tắm biển']
      },
      {
        region: 'Cung đường đèo hiểm trở Tây Bắc khi có sương mù dày',
        macroRegion: 'bac',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Sương mù dày đặc che khuất tầm nhìn dưới 5m trên các cung đèo dốc cao (Ô Quy Hồ, Mã Pí Lèng), đường trơn trượt nguy hiểm.',
        source: 'Cục Cảnh sát Giao thông & Đài KTTV Tây Bắc',
        tags: ['Sương mù dày', 'Đường trơn trượt', 'Tầm nhìn kém']
      }
    ]
  },
  {
    month: 3,
    title: 'Tháng 3 - Mùa Hoa Đỗ Quyên, Săn Mây Đại Ngàn & Hoa Cà Phê Tây Nguyên',
    seasonName: 'Giao mùa xuân hè, tiết trời trong trẻo',
    generalAdvice: 'Mùa săn mây đỉnh cao tại vùng núi cao phía Bắc, hoa cà phê nở trắng trời Tây Nguyên, biển miền Trung và miền Nam nắng vàng êm sóng.',
    destinations: [
      {
        region: 'Lào Cai (Dãy Hoàng Liên Sơn)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa đỗ quyên bung nở rực rỡ muôn sắc trên nóc nhà Đông Dương Fansipan; trời quang đãng, mây tầng bồng bềnh.',
        source: 'Traveloka 2026 & Vườn Quốc gia Hoàng Liên',
        tags: ['Hoa đỗ quyên', 'Fansipan', 'Trời trong']
      },
      {
        region: 'Hà Giang & Tây Bắc',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Hoa gạo đỏ rực đôi bờ dòng sông Nho Quế ngọc bích, săn mây đỉnh Tây Côn Lĩnh & Chiêu Lầu Thi hùng vĩ.',
        source: 'Traveloka 2026',
        tags: ['Hoa gạo sông Nho Quế', 'Săn mây Tây Côn Lĩnh']
      },
      {
        region: 'Tây Nguyên (Đắk Lắk, Gia Lai & Pleiku)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa cà phê nở trắng muốt ngút ngàn các triền đồi đất đỏ như tuyết trắng nhiệt đới, Lễ hội đua voi Buôn Đôn.',
        source: 'Sở VHTTDL Đắk Lắk',
        tags: ['Hoa cà phê trắng', 'Buôn Đôn', 'Biển Hồ Pleiku']
      },
      {
        region: 'Lâm Đồng (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa phượng tím nở lãng mạn ngập tràn các góc phố dốc Đà Lạt, thời tiết nắng ấm dịu dàng không mưa.',
        source: 'Sở Du lịch Lâm Đồng & VnExpress',
        tags: ['Hoa phượng tím', 'Khí hậu mát mẻ', 'Săn mây Cầu Đất']
      },
      {
        region: 'Đà Nẵng & Hội An',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khô mát, biển Mỹ Khê bắt đầu lặng sóng nước xanh biếc, phố cổ Hội An rực rỡ nắng vàng không khí trong trẻo.',
        source: 'Traveloka 2026 & TTXTDL Đà Nẵng',
        tags: ['Biển êm sóng lặng', 'Phố cổ Hội An', 'Bà Nà Hills']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Quy Nhơn, Phú Yên)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khởi đầu mùa du lịch biển, nước trong vắt, bãi Kỳ Co - Eo Gió lộng gió, Gành Đá Đĩa nắng đẹp rạng rỡ.',
        source: 'Sở Du lịch Bình Định & Khánh Hòa',
        tags: ['Kỳ Co Eo Gió', 'Gành Đá Đĩa', 'Biển trong xanh']
      },
      {
        region: 'Bà Rịa - Vũng Tàu & Cần Giờ',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa đỗ mai hồng rực đường lên ngọn Hải Đăng Vũng Tàu, thời tiết trong lành mát rượi, sóng biển êm dịu.',
        source: 'Cổng TT Du lịch Vũng Tàu',
        tags: ['Hoa đỗ mai', 'Hải đăng Vũng Tàu', 'Gió biển mát']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thời tiết khô ráo, nắng vàng ấm áp, thích hợp dã ngoại khám phá ẩm thực đường phố và trekking Ma Thiên Lãnh.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Mùa khô hoàn hảo', 'Ẩm thực Sài Gòn', 'Ma Thiên Lãnh']
      },
      {
        region: 'Kiên Giang (Phú Quốc & Hòn Sơn)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển êm ru, cát trắng mịn, hoàng hôn rực rỡ, lặn ngắm rạn san hô Hòn Gầm Ghì và Mây Rút tuyệt đẹp.',
        source: 'Traveloka 2026',
        tags: ['Lặn ngắm san hô', 'Biển phẳng lặng', 'Hoàng hôn đỉnh cao']
      },
      {
        region: 'Hà Nội & Đồng bằng Bắc Bộ (Mùa nồm ẩm)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Giai đoạn thời tiết "nồm ẩm" đặc trưng miền Bắc với độ ẩm không khí cao trên 90%, nền nhà ẩm ướt và sương mù dày.',
        source: 'Đài Khí tượng Thủy văn Quốc gia',
        tags: ['Nồm ẩm', 'Độ ẩm cao', 'Sương mù dày']
      },
      {
        region: 'Quảng Bình (Phong Nha - Kẻ Bàng)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết chuyển ấm, bắt đầu khám phá các hang động khô nhưng các tour hang nước thám hiểm sâu chưa vào mùa đỉnh.',
        source: 'Ban quản lý Vườn Quốc gia Phong Nha',
        tags: ['Hang Động Khô', 'Phong Nha', 'Chuyển mùa']
      },
      {
        region: 'Cung trekking núi đá hiểm trở khi nồm ẩm trơn trượt',
        macroRegion: 'bac',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Độ ẩm quá cao kết hợp rêu phong khiến bề mặt đá vôi tai mèo trơn trượt cực kỳ nguy hiểm cho các cung leo núi tự do.',
        source: 'Cẩm nang An toàn Du lịch Trekking',
        tags: ['Đá trơn rêu phong', 'Nguy cơ trượt ngã', 'Nên hoãn leo núi']
      }
    ]
  },
  {
    month: 4,
    title: 'Tháng 4 - Mùa Du Lịch Biển Toàn Diện & Nghỉ Lễ 30/4 - 1/5',
    seasonName: 'Thời điểm chuyển mình vào hè, biển trong vắt ba miền',
    generalAdvice: 'Khắp ba miền đều khô ráo, nắng ấm chan hòa. Đây là một trong những tháng đẹp nhất trong năm để du lịch bất kỳ đâu tại Việt Nam.',
    destinations: [
      {
        region: 'Quảng Ninh (Vịnh Hạ Long, Cô Tô)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nắng ấm bừng sáng mặt vịnh biển xanh ngắt, bắt đầu mùa chèo thuyền kayak và du thuyền ngủ đêm ngắm hoàng hôn.',
        source: 'Ban quản lý Vịnh Hạ Long & Traveloka',
        tags: ['Du thuyền Hạ Long', 'Chèo kayak', 'Biển xanh nắng ấm']
      },
      {
        region: 'Ninh Bình (Tràng An, Rừng Cúc Phương)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Lễ hội truyền thống Cố đô Hoa Lư, khí hậu mát mẻ dễ chịu, rừng Cúc Phương bắt đầu mùa bướm bay rợp lối đi.',
        source: 'Traveloka 2026 & Vườn Quốc gia Cúc Phương',
        tags: ['Lễ hội Hoa Lư', 'Mùa bướm Cúc Phương', 'Thuyền Tràng An']
      },
      {
        region: 'Hà Giang & Tây Bắc',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nước sông Nho Quế xanh màu ngọc bích tuyệt mỹ, đèo Mã Pí Lèng hùng vĩ dưới bầu trời không gợn mây.',
        source: 'Traveloka 2026',
        tags: ['Sông Nho Quế', 'Đèo Mã Pí Lèng', 'Trời xanh biếc']
      },
      {
        region: 'Đà Nẵng, Huế & Hội An',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thời tiết hoàn hảo nhất năm, biển Mỹ Khê cát trắng mịn màng, dịp đại lễ Phật Đản trang nghiêm tại các cổ tự Huế.',
        source: 'Traveloka 2026 & Sở Du lịch Đà Nẵng',
        tags: ['Biển Mỹ Khê', 'Lễ Phật Đản', 'Nắng đẹp hoàn hảo']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Quy Nhơn, Phú Yên)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển xanh màu ngọc bích, nắng rực rỡ, lặn ngắm san hô Hòn Mun, khám phá vịnh Vĩnh Hy và bãi Kỳ Co lộng lẫy.',
        source: 'Sở Du lịch Khánh Hòa & Ninh Thuận',
        tags: ['Lặn san hô Hòn Mun', 'Vịnh Vĩnh Hy', 'Bãi Kỳ Co']
      },
      {
        region: 'Tây Nguyên (Đà Lạt & Pleiku)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khí hậu mát mẻ dễ chịu 18-24°C, thích hợp cắm trại hồ Tuyền Lâm và đồi chè Cầu Đất trước khi vào mùa mưa.',
        source: 'Sở Du lịch Lâm Đồng',
        tags: ['Cắm trại hồ Tuyền Lâm', 'Khí hậu mát dịu', 'Đồi chè Cầu Đất']
      },
      {
        region: 'TP. Hồ Chí Minh, Vũng Tàu & Phú Quốc',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Tháng cao điểm nghỉ lễ 30/4 - 1/5. Biển êm, ẩm thực phong phú, Dinh Độc Lập và các di tích mở cửa đón hàng triệu lượt khách.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Kỳ nghỉ 30/4', 'Bãi biển Vũng Tàu', 'Dinh Độc Lập']
      },
      {
        region: 'Kiên Giang (Phú Quốc & Quần đảo An Thới)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Cuối mùa khô biển vẫn êm đềm tuyệt đẹp, nước trong nhìn thấy đáy rạn san hô, câu mực đêm Bãi Trường.',
        source: 'Traveloka 2026',
        tags: ['Biển êm cuối mùa khô', 'Câu mực đêm', 'Cát trắng Bãi Sao']
      },
      {
        region: 'Hà Nội & Vùng Thủ đô',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết ấm dần lên, dạo phố phường ngắm cây thay lá rất đẹp nhưng cuối tháng có thể xuất hiện đợt nắng nóng cục bộ.',
        source: 'Cổng TT Du lịch Hà Nội',
        tags: ['Mùa thay lá', 'Nắng ấm', 'Nhiệt độ tăng']
      },
      {
        region: 'Quảng Bình (Phong Nha - Kẻ Bàng)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Bắt đầu xuất hiện nắng nóng gió Lào miền Trung vào buổi trưa, nên tham quan động Phong Nha vào sáng sớm.',
        source: 'TTXTDL Quảng Bình',
        tags: ['Gió Lào nhẹ', 'Tham quan sáng sớm']
      },
      {
        region: 'Đồng bằng Sông Cửu Long',
        macroRegion: 'nam',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mực nước ngọt trên các kênh rạch cạn hơn do cuối mùa khô, trời oi bức ban ngày, thích hợp du lịch sinh thái rừng tràm Trà Sư.',
        source: 'Sở Du lịch An Giang',
        tags: ['Rừng tràm Trà Sư', 'Nắng nóng ban ngày']
      },
      {
        region: 'Các điểm du lịch quá tải dịp lễ 30/4 không đặt chỗ trước',
        macroRegion: 'nam',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Tình trạng cháy phòng khách sạn, kẹt xe hàng giờ tại các cửa ngõ cao tốc và bến phà biển nếu không lên kế hoạch sớm.',
        source: 'Cục Du lịch Quốc gia Việt Nam',
        tags: ['Cháy phòng lễ 30/4', 'Kẹt xe cao tốc', 'Cần đặt trước']
      }
    ]
  },
  {
    month: 5,
    title: 'Tháng 5 - Mùa Nước Đổ Ruộng Bậc Thang, Lúa Chín Tam Cốc & Pháo Hoa Đà Nẵng',
    seasonName: 'Chính thức bước vào mùa hè nhiệt đới',
    generalAdvice: 'Miền Bắc đón mùa nước đổ ruộng bậc thang và lúa chín Tam Cốc vàng rực; miền Trung ngập tràn nắng biển; miền Nam bắt đầu mùa mưa rào chiều.',
    destinations: [
      {
        region: 'Ninh Bình (Tam Cốc - Bích Động)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa vàng Tam Cốc đẹp nhất năm: cánh đồng lúa chín vàng ươm hai bên dòng sông Ngô Đồng kết hợp mùa sen nở thơm ngát.',
        source: 'Traveloka 2026 & VnExpress Du Lịch',
        tags: ['Tam Cốc mùa vàng', 'Mùa sen Bích Động', 'Thuyền nan']
      },
      {
        region: 'Lào Cai (Sa Pa, Y Tý) & Yên Bái (Mù Cang Chải)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Kỳ quan mùa nước đổ: những thửa ruộng bậc thang kỳ vĩ long lanh như những tấm gương khổng lồ phản chiếu mây trời.',
        source: 'Traveloka 2026 & TTXTDL Lào Cai',
        tags: ['Mùa nước đổ', 'Kỳ quan ruộng bậc thang', 'Góc máy nhiếp ảnh']
      },
      {
        region: 'Đà Nẵng & Hội An (Lễ hội Pháo hoa DIFF)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khai mạc Lễ hội Pháo hoa Quốc tế Đà Nẵng (DIFF), biển xanh ngắt, các khu nghỉ dưỡng sôi động, Bà Nà Hills rực rỡ.',
        source: 'Traveloka 2026 & Ban tổ chức DIFF Đà Nẵng',
        tags: ['Lễ hội pháo hoa DIFF', 'Tắm biển Mỹ Khê', 'Bà Nà Hills']
      },
      {
        region: 'Quảng Ninh (Vịnh Hạ Long, Cô Tô)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nắng vàng biển êm, mùa lý tưởng chèo thuyền kayak, tắm biển đảo Cô Tô và du thuyền thưởng ngoạn kỳ quan thế giới.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Biển đảo Cô Tô', 'Chèo kayak', 'Du thuyền 5 sao']
      },
      {
        region: 'Quảng Bình (Phong Nha, Hang Én, Tú Làn)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thời điểm vàng trekking thám hiểm hệ thống hang động Sơn Đoòng, Tú Làn, hang Tối với mực nước ngầm ổn định, trong xanh.',
        source: 'Oxalis Adventure & TTXTDL Quảng Bình',
        tags: ['Thám hiểm Sơn Đoòng', 'Hang Tú Làn', 'Sông Chày']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Quy Nhơn, Phú Yên)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nắng vàng biển biếc, thời tiết khô ráo tuyệt đối, lặn biển ngắm san hô bãi Kỳ Co, hòn Khô, đầm Ô Loan hải sản phong phú.',
        source: 'Sở Du lịch Bình Định & Khánh Hòa',
        tags: ['Nắng vàng biển xanh', 'Kỳ Co Hòn Khô', 'Hải sản phong phú']
      },
      {
        region: 'ĐBSCL (Bến Tre, Tiền Giang, Cần Thơ)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Bắt đầu rộ mùa chôm chôm, măng cụt, sầu riêng miệt vườn Bến Tre, Tiền Giang. Trải nghiệm hái trái cây ăn tại vườn.',
        source: 'Sở Nông nghiệp & Du lịch Tiền Giang',
        tags: ['Vườn trái cây rộ mùa', 'Ẩm thực miệt vườn', 'Chôm chôm sầu riêng']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nắng ban ngày ấm áp, thỉnh thoảng có mưa rào chiều giải nhiệt nhanh chóng, tham quan các bảo tàng và di tích lịch sử.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Mưa rào chiều nhẹ', 'Di tích lịch sử', 'Ẩm thực phong phú']
      },
      {
        region: 'Hà Nội & Vùng Đồng bằng Bắc Bộ',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Bắt đầu các đợt nắng nóng đầu mùa 33-36°C, nên sắp xếp lịch trình tham quan ngoài trời vào sáng sớm hoặc chiều tà.',
        source: 'Cổng TT Du lịch Hà Nội',
        tags: ['Nắng nóng đầu mùa', 'Tham quan sáng sớm']
      },
      {
        region: 'Huế & Quảng Trị (Bắc Trung Bộ)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Gió Lào khô nóng thổi mạnh vào buổi trưa chiều nhiệt độ có thể lên đến 37°C, nên tham quan Đại Nội vào buổi sáng.',
        source: 'Trung tâm Bảo tồn Di tích Cố đô Huế',
        tags: ['Gió Lào khô nóng', 'Nhiệt độ cao ban trưa']
      },
      {
        region: 'Tây Nguyên (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Bắt đầu xuất hiện những cơn mưa rào đầu mùa vào đầu giờ chiều, thích hợp ngắm mưa tại các quán cafe view thung lũng.',
        source: 'Sở Du lịch Lâm Đồng',
        tags: ['Mưa rào đầu mùa', 'Cafe ngắm mưa thung lũng']
      },
      {
        region: 'Kiên Giang (Phú Quốc bờ Tây)',
        macroRegion: 'nam',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Bắt đầu chuyển mùa gió Tây Nam, các bãi biển bờ Tây (Bãi Trường, Bãi Dài) có thể có sóng lớn và dòng chảy xiết; nên chuyển sang bờ Đông.',
        source: 'Đài Khí tượng Thủy văn Kiên Giang',
        tags: ['Gió mùa Tây Nam', 'Sóng lớn bờ Tây', 'Nên chuyển sang bờ Đông']
      }
    ]
  },
  {
    month: 6,
    title: 'Tháng 6 - Cao Điểm Du Lịch Hè, Biển Miền Trung & Vịnh Bắc Bộ Rực Rỡ',
    seasonName: 'Mùa hè rực nắng, thiên đường nghỉ mát biển đảo',
    generalAdvice: 'Biển miền Trung và Vịnh Bắc Bộ vào độ đẹp nhất trong năm. Các vùng núi cao mát lạnh như Sa Pa, Đà Lạt là điểm tránh nóng lý tưởng.',
    destinations: [
      {
        region: 'Quảng Ninh (Vịnh Hạ Long, Vịnh Lan Hạ, Cô Tô)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển êm xanh ngắt, trời trong veo không gợn mây, mùa hè rực rỡ cho các hoạt động thể thao biển, chèo SUP và du thuyền ngủ đêm.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Vịnh biển xanh ngắt', 'Chèo SUP', 'Du thuyền 5 sao']
      },
      {
        region: 'Đà Nẵng, Hội An & Quảng Ngãi (Đảo Lý Sơn)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Cao điểm mùa hè biển miền Trung đẹp tuyệt mỹ, Lễ hội pháo hoa DIFF náo nhiệt, lặn biển ngắm cổng Tò Vò đảo Lý Sơn.',
        source: 'Traveloka 2026 & TTXTDL Đà Nẵng',
        tags: ['Đảo Lý Sơn', 'Pháo hoa DIFF', 'Biển Mỹ Khê']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Quy Nhơn, Phú Yên, Mũi Né)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Nắng vàng biển ngọc, bãi Kỳ Co, Eo Gió, vịnh Cam Ranh lộng lẫy, nước biển trong vắt nhìn thấy đáy, hải sản phong phú.',
        source: 'Sở Du lịch Khánh Hòa & Bình Định',
        tags: ['Nắng vàng biển ngọc', 'Kỳ Co Eo Gió', 'Vịnh Cam Ranh']
      },
      {
        region: 'Quảng Bình (Phong Nha, Hang Tối, Suối Moọc)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Suối Nước Moọc dòng nước xanh ngọc bích mát lạnh 20°C là điểm giải nhiệt mùa hè hàng đầu, chèo kayak sông Chày.',
        source: 'TTXTDL Quảng Bình',
        tags: ['Suối Nước Moọc', 'Giải nhiệt mùa hè', 'Chèo kayak']
      },
      {
        region: 'Ninh Bình & Hà Nội (Mùa sen Hồ Tây & Bích Động)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa sen nở rộ thơm ngát đầm sen Bích Động và hồ Tây Hà Nội, chụp ảnh áo dài truyền thống tuyệt đẹp.',
        source: 'Cổng TT Du lịch Hà Nội',
        tags: ['Mùa sen Hồ Tây', 'Sen Bích Động', 'Check-in áo dài']
      },
      {
        region: 'Lào Cai (Sa Pa) & Lâm Đồng (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Hai "thiên đường tránh nóng" mát mẻ quanh năm 18-22°C giữa hè rực lửa, mận hậu chín đỏ cành tại Sa Pa và Mộc Châu.',
        source: 'Traveloka 2026',
        tags: ['Thiên đường tránh nóng', 'Mát mẻ 20°C', 'Mận hậu chín đỏ']
      },
      {
        region: 'ĐBSCL (Tiền Giang, Bến Tre, Vĩnh Long)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Chính vụ lễ hội trái cây Nam Bộ, vườn chôm chôm, bòn bon, măng cụt chín trĩu cành, chèo xuồng rợp bóng dừa mát rượi.',
        source: 'Sở Du lịch Tiền Giang & Bến Tre',
        tags: ['Lễ hội trái cây', 'Miệt vườn trĩu quả', 'Chèo xuồng ba lá']
      },
      {
        region: 'TP. Hồ Chí Minh & Bà Rịa - Vũng Tàu',
        macroRegion: 'nam',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mùa mưa Nam Bộ, thường có mưa rào bất chợt vào chiều muộn (khoảng 1 tiếng) rồi tạnh ráo, buổi sáng vẫn nắng đẹp tắm biển tốt.',
        source: 'Cổng TT Du lịch TP.HCM & Vũng Tàu',
        tags: ['Mưa rào chiều', 'Buổi sáng nắng đẹp', 'Tắm biển sáng']
      },
      {
        region: 'Hà Giang & Sơn La (Mộc Châu)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mùa hè xanh mướt mát mẻ, thỉnh thoảng có mưa dông vùng cao vào buổi chiều tối, nên theo dõi thời tiết khi đi đèo.',
        source: 'Cổng TT Du lịch Hà Giang',
        tags: ['Mát mẻ vùng cao', 'Mưa dông chiều']
      },
      {
        region: 'Hà Nội & Bắc Bộ (Đợt nắng nóng cao điểm)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Nắng nóng đỉnh điểm có thể lên tới 38-39°C giữa trưa, ưu tiên các bảo tàng máy lạnh, di tích trong nhà hoặc đi dạo tối.',
        source: 'Đài Khí tượng Quốc gia',
        tags: ['Nắng nóng 38°C', 'Tham quan ban tối']
      },
      {
        region: 'Kiên Giang (Phú Quốc & Quần đảo Nam Du)',
        macroRegion: 'nam',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Gió mùa Tây Nam hoạt động mạnh, bờ Tây sóng lớn, tàu cao tốc Rạch Giá - Nam Du/Phú Quốc có thể bị cấm chạy do biển động.',
        source: 'Cảng vụ Hàng hải Kiên Giang',
        tags: ['Biển động gió Tây Nam', 'Tàu cao tốc hoãn chuyến', 'Sóng lớn']
      },
      {
        region: 'Đường đèo dốc hiểm trở Tây Bắc khi mưa giông lớn',
        macroRegion: 'bac',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Nguy cơ sạt lở đất đá cục bộ sau các đợt mưa giông lớn trên các cung đèo dốc hiểm trở, hạn chế phượt đêm.',
        source: 'Cục Đường bộ Việt Nam',
        tags: ['Nguy cơ sạt lở', 'Mưa giông lớn', 'Hạn chế đi đêm']
      }
    ]
  },
  {
    month: 7,
    title: 'Tháng 7 - Đỉnh Cao Du Lịch Nghỉ Mát Hè & Cảnh Giác Mưa Giông Vùng Cao',
    seasonName: 'Mùa hè biển đảo rực rỡ nhất miền Trung',
    generalAdvice: 'Duyên hải Nam Trung Bộ nắng vàng biển ngọc không mưa bão. Vùng núi phía Bắc bắt đầu cao điểm mưa ngâu, cần chú ý an toàn đèo núi.',
    destinations: [
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Quy Nhơn, Phú Yên, Ninh Thuận)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển đẹp nhất trong năm, nắng vàng ươm, không mưa bão, nước trong vắt nhìn thấy đáy san hô, ẩm thực hải sản phong phú.',
        source: 'Sở Du lịch Khánh Hòa & Bình Định',
        tags: ['Biển đẹp nhất năm', 'Nước trong vắt', 'Hải sản phong phú']
      },
      {
        region: 'Đà Nẵng & Hội An',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Đêm chung kết Lễ hội pháo hoa quốc tế DIFF, lặn biển ngắm san hô Cù Lao Chàm, phố cổ Hội An rực rỡ đèn lồng.',
        source: 'TTXTDL Đà Nẵng & Quảng Nam',
        tags: ['Chung kết pháo hoa DIFF', 'Cù Lao Chàm', 'Biển Mỹ Khê']
      },
      {
        region: 'Quảng Ninh (Vịnh Hạ Long, Đảo Quan Lạn)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển xanh nắng rực, mùa cao điểm tour du thuyền 5 sao vịnh Bái Tử Long và tắm biển bãi cát trắng Quan Lạn, Minh Châu.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Du thuyền 5 sao', 'Đảo Quan Lạn', 'Biển xanh cát trắng']
      },
      {
        region: 'Quảng Bình (Phong Nha, Sông Chày, Suối Moọc)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khám phá hang động kỳ vĩ trốn nắng nóng nhiệt đới, chèo thuyền kayak và tắm suối khoáng mát lạnh.',
        source: 'TTXTDL Quảng Bình',
        tags: ['Động Phong Nha', 'Sông Chày Hang Tối', 'Giải nhiệt hè']
      },
      {
        region: 'Lâm Đồng (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa mưa phùn phố núi mát lạnh 16-20°C, thưởng thức cafe ấm cúng và check-in các khu vườn hoa cẩm tú cầu ngút ngàn.',
        source: 'Sở Du lịch Lâm Đồng',
        tags: ['Hoa cẩm tú cầu', 'Mát lạnh 18°C', 'Cafe ngắm mưa']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Tham quan các bảo tàng mát mẻ, công viên nước, dã ngoại cáp treo Núi Bà Đen buổi sáng khô ráo mát lành.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Bảo tàng lịch sử', 'Núi Bà Đen', 'Công viên giải trí']
      },
      {
        region: 'ĐBSCL (Cần Thơ, Bến Tre, Sóc Trăng)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Trải nghiệm ẩm thực dân dã miệt vườn, chèo xuồng ba lá dưới bóng râm rặng dừa nước mát rượi, thưởng thức bánh xèo miền Tây.',
        source: 'Sở VHTTDL Cần Thơ',
        tags: ['Chèo xuồng rặng dừa', 'Bánh xèo miền Tây', 'Chợ nổi Cái Răng']
      },
      {
        region: 'Hà Nội & Vùng Đồng bằng Bắc Bộ',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Nắng nóng gay gắt kết hợp mưa giông mùa hè bất chợt (mưa rào chiều), nên theo dõi dự báo thời tiết hàng ngày.',
        source: 'Cổng TT Du lịch Hà Nội',
        tags: ['Mưa rào hè', 'Nắng nóng ban ngày']
      },
      {
        region: 'Ninh Bình (Tràng An, Tam Cốc)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Trời khá nóng ban ngày, thích hợp đi thuyền Tràng An lúc 06:30 sáng hoặc 16:00 chiều để tránh nắng gắt.',
        source: 'Ban quản lý Tràng An',
        tags: ['Đi thuyền sáng sớm', 'Tránh nắng ban trưa']
      },
      {
        region: 'Bà Rịa - Vũng Tàu',
        macroRegion: 'nam',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thường có mưa rào vào đầu giờ chiều, thời gian tắm biển tốt nhất từ 06:00 - 10:00 sáng khi trời trong và sóng nhẹ.',
        source: 'Cổng TT Du lịch Vũng Tàu',
        tags: ['Tắm biển sáng sớm', 'Mưa rào chiều']
      },
      {
        region: 'Tây Bắc Bộ (Sa Pa, Mù Cang Chải, Lai Châu) khi mưa bão',
        macroRegion: 'bac',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Cao điểm mùa mưa lũ vùng núi phía Bắc, nguy cơ sạt lở đất đá trên đèo dốc và lũ ống lũ quét suối cao, nên tránh phượt mạo hiểm.',
        source: 'Ban chỉ đạo Quốc gia về Phòng chống Thiên tai',
        tags: ['Cao điểm mưa lũ', 'Sạt lở đất đèo dốc', 'Tránh phượt mạo hiểm']
      },
      {
        region: 'Kiên Giang (Phú Quốc & Quần đảo Tây Nam)',
        macroRegion: 'nam',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Gió mùa Tây Nam đạt đỉnh, sóng biển lớn bờ Tây, mưa nhiều ngày liên tục làm giảm trải nghiệm lặn biển và cano đảo.',
        source: 'Đài KTTV Kiên Giang',
        tags: ['Sóng biển lớn', 'Mưa dầm gió Tây Nam', 'Hạn chế cano đảo']
      }
    ]
  },
  {
    month: 8,
    title: 'Tháng 8 - Giao Mùa Thu Bắc Bộ, Nắng Biển Nam Trung Bộ & Chớm Mùa Nước Nổi',
    seasonName: 'Chớm thu phương Bắc, hè muộn phương Nam',
    generalAdvice: 'Hà Nội và Ninh Bình bước vào mùa thu trong trẻo se mát; duyên hải Nam Trung Bộ giữ vững biển xanh nắng rực rỡ; miền Tây đón những con nước đầu nguồn.',
    destinations: [
      {
        region: 'Hà Nội & Đồng bằng Bắc Bộ',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Bắt đầu chớm mùa thu Hà Nội, gió heo may se mát, hương hoa sữa thoang thoảng góc phố, cốm non làng Vòng vào vụ.',
        source: 'Traveloka 2026 & Báo Hà Nội Mới',
        tags: ['Chớm thu Hà Nội', 'Cốm non làng Vòng', 'Gió heo may']
      },
      {
        region: 'Ninh Bình (Tràng An)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa thu nước sông trong vắt nhìn thấy rong rêu đáy nước, thời tiết bớt oi bức, vãn cảnh non nước hữu tình thanh tịnh.',
        source: 'Ban quản lý Tràng An',
        tags: ['Tràng An nước trong vắt', 'Khí hậu mùa thu', 'Non nước hữu tình']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Nha Trang, Ninh Thuận, Phan Thiết)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển vẫn giữ sắc xanh biếc tuyệt đẹp, ít mưa nhất cả nước, thiên đường nghỉ dưỡng biển hè muộn, đồi cát Mũi Né lộng lẫy.',
        source: 'Sở Du lịch Bình Thuận & Khánh Hòa',
        tags: ['Nghỉ dưỡng biển hè muộn', 'Đồi cát Mũi Né', 'Biển xanh biếc']
      },
      {
        region: 'Đà Nẵng & Hội An',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Vẫn trong mùa khô nắng đẹp, phố cổ Hội An về đêm lung linh rực rỡ, biển Mỹ Khê êm đềm trước khi vào mùa mưa bão.',
        source: 'TTXTDL Đà Nẵng',
        tags: ['Phố cổ Hội An', 'Biển Mỹ Khê êm', 'Nắng đẹp cuối hè']
      },
      {
        region: 'Lâm Đồng (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Không khí mộng mơ mát lành, ngắm sương mù giăng kín thung lũng thông reo, thưởng thức lẩu gà lá é ấm cúng.',
        source: 'Sở Du lịch Lâm Đồng',
        tags: ['Sương mù thung lũng', 'Khí hậu mát lành', 'Lẩu gà lá é']
      },
      {
        region: 'ĐBSCL (An Giang, Đồng Tháp - Chớm mùa nước nổi)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Đón những con nước đầu nguồn Mê Kông tràn về, rừng tràm Trà Sư phủ thảm bèo cám xanh ngắt tuyệt mỹ, bông điên điển chớm vàng.',
        source: 'Sở Du lịch An Giang & Đồng Tháp',
        tags: ['Rừng tràm Trà Sư', 'Bèo cám xanh ngắt', 'Nước nổi đầu nguồn']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mưa rào giảm dần thời lượng, thời tiết mát mẻ dễ chịu hơn cao điểm mùa hè, thích hợp viếng chùa và du lịch ẩm thực.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Thời tiết mát dịu', 'Ẩm thực phong phú', 'Du lịch di tích']
      },
      {
        region: 'Quảng Ninh (Vịnh Hạ Long)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết thu mát mẻ nhưng tháng 8 thỉnh thoảng có áp thấp nhiệt đới trên biển Đông, nên theo dõi dự báo thời tiết biển trước 3 ngày.',
        source: 'Đài KTTV Đông Bắc',
        tags: ['Theo dõi thời tiết biển', 'Thu mát mẻ']
      },
      {
        region: 'Lào Cai & Hà Giang',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Lúa trên các triền ruộng bậc thang bắt đầu ngả vàng lốm đốm, cảnh sắc chuyển mình đẹp nhưng thỉnh thoảng còn mưa dông.',
        source: 'TTXTDL Lào Cai',
        tags: ['Lúa chớm vàng', 'Chuyển mùa']
      },
      {
        region: 'Thừa Thiên Huế & Quảng Trị',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Cuối tháng 8 bắt đầu đón những cơn mưa thu dài ngày, phố xá cố đô trầm mặc, thích hợp du khách yêu nét tĩnh lặng.',
        source: 'Trung tâm BTDT Cố đô Huế',
        tags: ['Mưa thu dài ngày', 'Cố đô trầm mặc']
      },
      {
        region: 'Kiên Giang (Phú Quốc)',
        macroRegion: 'nam',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Vẫn nằm trong mùa mưa gió Tây Nam, biển động sóng lớn, tour lặn ngắm san hô bị hạn chế, bờ biển có nhiều rác đại dương dạt vào.',
        source: 'Cảng vụ Hàng hải Kiên Giang',
        tags: ['Sóng biển lớn', 'Biển động', 'Mưa gió Tây Nam']
      },
      {
        region: 'Tuyến tàu ra các đảo xa ngoài khơi khi có cảnh báo biển động',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Các tuyến tàu cao tốc ra đảo Cô Tô, Côn Đảo, Phú Quý dễ bị đình chỉ hoạt động khi có gió mùa cấp 6 trở lên.',
        source: 'Cục Đường thủy Nội địa',
        tags: ['Tàu hoãn chuyến', 'Biển động cấp 6', 'Cảnh giác thời tiết']
      }
    ]
  },
  {
    month: 9,
    title: 'Tháng 9 - Mùa Lúa Chín Vàng Tây Bắc, Mùa Thu Hà Nội & Chính Vụ Nước Nổi Miền Tây',
    seasonName: 'Mùa thu vàng rực rỡ phương Bắc & Mùa nước nổi phương Nam',
    generalAdvice: 'Đỉnh cao mùa lúa chín Mù Cang Chải, Sa Pa; mùa thu Hà Nội đẹp nao lòng; miền Tây chính vụ nước nổi; riêng miền Trung bắt đầu mùa mưa bão lớn.',
    destinations: [
      {
        region: 'Lào Cai (Sa Pa, Y Tý) & Yên Bái (Mù Cang Chải)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'ĐỈNH CAO MÙA LÚA CHÍN VÀNG RỰC RỠ: Ruộng bậc thang Mù Cang Chải, thung lũng Mường Hoa dát vàng óng ả thơm ngát hương lúa mới.',
        source: 'Traveloka 2026 & TTXTDL Lào Cai',
        tags: ['Mù Cang Chải lúa chín', 'Thung lũng Mường Hoa', 'Ruộng bậc thang vàng']
      },
      {
        region: 'Hà Giang (Hoàng Su Phì, Đồng Văn)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Di sản ruộng bậc thang Hoàng Su Phì vàng rực lưng trời, sông Nho Quế biêng biếc, tiết trời thu trong xanh mát rượi.',
        source: 'Cổng TT Du lịch Hà Giang',
        tags: ['Hoàng Su Phì lúa vàng', 'Sông Nho Quế thu', 'Thời tiết mát dịu']
      },
      {
        region: 'Hà Nội & Vùng Thủ đô',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'MÙA THU HÀ NỘI ĐẸP NHẤT TRONG NĂM: Tiết trời se lạnh 22-28°C, nắng vàng hanh hao, hoa sữa nồng nàn góc phố Phan Đình Phùng, Hoàng Diệu.',
        source: 'Traveloka 2026 & Báo Hà Nội Mới',
        tags: ['Thu Hà Nội đỉnh cao', 'Phan Đình Phùng', 'Hoa sữa nồng nàn']
      },
      {
        region: 'Ninh Bình (Tràng An, Tam Cốc)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Trời thu trong xanh vắt, nước sông Ngô Đồng mát lạnh nhìn thấy đáy rong rêu, không khí thanh tịnh tuyệt đối.',
        source: 'Ban quản lý Tràng An',
        tags: ['Tràng An mùa thu', 'Nước trong mát', 'Thời tiết lý tưởng']
      },
      {
        region: 'ĐBSCL (An Giang, Đồng Tháp, Cần Thơ)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'CHÍNH VỤ MÙA NƯỚC NỔI MIỀN TÂY: Cánh đồng ngập nước rực rỡ hoa điên điển vàng, cá linh non béo ngậy, chợ nổi Cái Răng tấp nập.',
        source: 'Sở VHTTDL An Giang & Đồng Tháp',
        tags: ['Chính vụ mùa nước nổi', 'Cá linh bông điên điển', 'Rừng tràm Trà Sư']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Ninh Thuận, Bình Thuận)',
        macroRegion: 'trung',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thời tiết khô ráo nhiều nắng, mùa nho chín bạt ngàn tại Ninh Thuận, cung đường biển Cà Ná hùng vĩ.',
        source: 'Sở VHTTDL Ninh Thuận',
        tags: ['Vườn nho Ninh Thuận', 'Cung đường biển Cà Ná', 'Khô ráo']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khí hậu mát mẻ dễ chịu, mùa mua sắm và vui chơi lễ hội Trung thu rực rỡ phố lồng đèn Lương Nhữ Học Quận 5.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Phố lồng đèn Quận 5', 'Lễ hội Trung thu', 'Ẩm thực Chợ Lớn']
      },
      {
        region: 'Tây Nguyên (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mưa chiều thu lãng mạn nhưng có thể gây gián đoạn hoạt động ngoài trời, thích hợp cafe và thưởng thức đồ nướng.',
        source: 'Sở Du lịch Lâm Đồng',
        tags: ['Mưa chiều thu', 'Cafe lãng mạn']
      },
      {
        region: 'Quảng Ninh (Vịnh Hạ Long)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết thu mát mẻ rất dễ chịu nhưng cần chú ý bão muộn trên biển Đông có thể làm hoãn tour du thuyền.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Thu mát dịu', 'Chú ý bão muộn']
      },
      {
        region: 'Khánh Hòa (Nha Trang)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Bắt đầu chuyển mùa, cuối tháng có thể có những trận mưa giông rải rác, biển bắt đầu có sóng lớn hơn.',
        source: 'Sở Du lịch Khánh Hòa',
        tags: ['Chuyển mùa', 'Mưa rải rác']
      },
      {
        region: 'Đà Nẵng, Quảng Nam (Hội An) & Thừa Thiên Huế',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Chính thức bước vào mùa mưa bão lớn của miền Trung. Biển động mạnh, nguy cơ ngập lụt phố cổ Hội An và sạt lở đèo Hải Vân.',
        source: 'Đài Khí tượng Miền Trung & Ban Chỉ huy PCTT',
        tags: ['Mùa mưa bão miền Trung', 'Ngập lụt Hội An', 'Biển động mạnh']
      },
      {
        region: 'Quảng Bình (Phong Nha - Kẻ Bàng)',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Mưa lớn kéo dài khiến mực nước sông ngầm dâng cao ngập cửa hang động Phong Nha, tạm dừng các tour thám hiểm hang.',
        source: 'Ban quản lý VQG Phong Nha - Kẻ Bàng',
        tags: ['Nước sông ngầm dâng cao', 'Đóng cửa hang động', 'Mưa lớn']
      }
    ]
  },
  {
    month: 10,
    title: 'Tháng 10 - Mùa Hoa Tam Giác Mạch, Mùa Thu Dịu Dàng & Mùa Khô Phương Nam',
    seasonName: 'Mùa hoa cao nguyên đá & Phương Nam dứt mưa',
    generalAdvice: 'Hà Giang rực rỡ Lễ hội Hoa Tam Giác Mạch; miền Bắc se lạnh khô ráo; miền Nam mưa giảm hẳn sang mùa khô; miền Trung vào đỉnh bão lũ.',
    destinations: [
      {
        region: 'Hà Giang (Đồng Văn, Lũng Cú, Mèo Vạc)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Khai mạc Lễ hội Hoa Tam Giác Mạch toàn tỉnh, hoa nở rộ nhuộm sắc tím hồng khắp các sườn núi đá tai mèo cổ kính.',
        source: 'Traveloka 2026 & Sở VHTTDL Hà Giang',
        tags: ['Lễ hội Tam Giác Mạch', 'Cột cờ Lũng Cú', 'Sắc hoa tím hồng']
      },
      {
        region: 'Hà Nội & Vùng Thủ Đô',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Kỷ niệm Ngày Giải phóng Thủ đô 10/10 với cờ hoa rợp trời, tiết trời thu se lạnh khô ráo, dạo Hồ Gươm và thưởng thức cốm.',
        source: 'Traveloka 2026 & Cổng TT Hà Nội',
        tags: ['Giải phóng Thủ đô 10/10', 'Thu se lạnh', 'Hồ Gươm cờ hoa']
      },
      {
        region: 'Lào Cai (Sa Pa, Fansipan)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Bắt đầu mùa săn mây chớm đông bồng bềnh, thời tiết khô ráo, se lạnh 12-16°C, ngắm thung lũng Mường Hoa sau mùa gặt.',
        source: 'TTXTDL Lào Cai',
        tags: ['Săn mây chớm đông', 'Se lạnh khô ráo', 'Fansipan']
      },
      {
        region: 'Sơn La (Mộc Châu)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Bắt đầu mùa hoa cải trắng nở rộ sớm trên các triền đồi bản Pa Phách, thung lũng mận xanh mướt mát lạnh.',
        source: 'Cổng TT Du lịch Sơn La',
        tags: ['Hoa cải trắng nở sớm', 'Bản Pa Phách', 'Cao nguyên Mộc Châu']
      },
      {
        region: 'ĐBSCL (An Giang, Cần Thơ, Đồng Tháp)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Đỉnh lũ hiền hòa mùa nước nổi miền Tây, chợ nổi Cái Răng tấp nập thuyền buôn nông sản, rừng tràm rợp bóng chim về tổ.',
        source: 'Sở VHTTDL Cần Thơ & An Giang',
        tags: ['Đỉnh lũ hiền hòa', 'Chợ nổi Cái Răng', 'Mùa chim về tổ']
      },
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa mưa Nam Bộ kết thúc, tiết trời khô ráo, nắng dịu mát mẻ 23-31°C, lý tưởng leo Núi Bà Đen và khám phá di tích.',
        source: 'Cổng TT Du lịch TP.HCM',
        tags: ['Dứt mùa mưa', 'Nắng dịu mát mẻ', 'Dã ngoại Núi Bà']
      },
      {
        region: 'Bà Rịa - Vũng Tàu',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Biển êm trở lại, gió mát trong lành, sóng nhẹ, mùa nghỉ dưỡng cuối tuần tuyệt đẹp không mưa.',
        source: 'Cổng TT Du lịch Vũng Tàu',
        tags: ['Biển êm trở lại', 'Gió mát trong lành', 'Nghỉ dưỡng cuối tuần']
      },
      {
        region: 'Kiên Giang (Phú Quốc)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Cuối tháng 10 chuyển mùa sang mùa khô, biển êm dần, bãi biển phía Tây sạch sóng, bắt đầu đón khách quốc tế trú đông.',
        source: 'Traveloka 2026',
        tags: ['Biển êm chuyển mùa', 'Khởi đầu mùa khô', 'Nắng ấm trở lại']
      },
      {
        region: 'Tây Nguyên (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Hoa dã quỳ bắt đầu chớm nở vàng ven đèo Mimosa, thỉnh thoảng còn những cơn mưa chuyển mùa cuối cùng.',
        source: 'Sở Du lịch Lâm Đồng',
        tags: ['Dã quỳ chớm nở', 'Đèo Mimosa', 'Mưa chuyển mùa']
      },
      {
        region: 'Quảng Ninh & Ninh Bình',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết thu se lạnh, khô ráo ít mưa, cảnh vật tĩnh mịch nhưng cần chuẩn bị áo khoác nhẹ khi đi thuyền hoặc vịnh biển.',
        source: 'Cổng TT Du lịch Quảng Ninh',
        tags: ['Thu se lạnh', 'Áo khoác nhẹ', 'Cảnh sắc tĩnh lặng']
      },
      {
        region: 'Đà Nẵng, Hội An, Thừa Thiên Huế & Quảng Bình',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'ĐỈNH ĐIỂM BÃO LŨ MIỀN TRUNG: Mưa to kỷ lục kéo dài, nước ngập lụt phố cổ Hội An và ven sông Hương, đường sá đèo Hải Vân sạt lở nguy hiểm.',
        source: 'Traveloka 2026 & Đài KTTV Miền Trung',
        tags: ['Đỉnh điểm bão lũ', 'Lũ lụt ngập phố cổ', 'Nên hoãn chuyến đi']
      },
      {
        region: 'Bình Định (Quy Nhơn) & Phú Yên',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Mưa lớn do ảnh hưởng bão nhiệt đới dồn dập, biển động dữ dội, cấm hoàn toàn cano ra đảo Kỳ Co và Cù Lao Xanh.',
        source: 'Ban Chỉ huy PCTT Tỉnh Bình Định',
        tags: ['Biển động dữ dội', 'Cấm cano đảo', 'Mưa lớn bão biển']
      }
    ]
  },
  {
    month: 11,
    title: 'Tháng 11 - Mùa Hoa Dã Quỳ, Cải Trắng & Chính Vụ Du Lịch Biển Phương Nam',
    seasonName: 'Đầu đông phương Bắc, chính vụ du lịch phương Nam',
    generalAdvice: 'Hoa dã quỳ vàng rực khắp Ba Vì và Đà Lạt; hoa cải trắng Mộc Châu nở bạt ngàn. Phương Nam bước vào thời tiết đẹp nhất: nắng rực, biển êm ru.',
    destinations: [
      {
        region: 'TP. Hồ Chí Minh & Các Tỉnh Lân Cận',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Chính thức vào mùa khô rực rỡ nhất: nhiệt độ 22-31°C, nắng vàng tươi, gió nhẹ, hoàn hảo để khám phá 77+ di tích & ẩm thực LonGo.',
        source: 'Cổng TT Du lịch TP.HCM & VnExpress',
        tags: ['Mùa khô hoàn hảo', 'Không mưa', 'Nắng đẹp', 'Di tích & Ẩm thực']
      },
      {
        region: 'Bà Rịa - Vũng Tàu, Phú Quốc & Côn Đảo',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa biển đẹp nhất năm của Nam Bộ: biển xanh biếc như ngọc bích, sóng êm ru, lặn ngắm san hô và hải sản dồi dào tươi ngon.',
        source: 'Traveloka & Zing News',
        tags: ['Biển xanh ngọc', 'Sóng êm ru', 'Lặn san hô', 'Tắm biển lý tưởng']
      },
      {
        region: 'Lâm Đồng (Đà Lạt) & Tây Nguyên',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'MÙA HOA DÃ QUỲ VÀNG RỰC RỠ: Nhuộm vàng sườn núi lửa Chư Đăng Ya (Gia Lai) và đèo Prenn (Đà Lạt), đồi cỏ hồng bạt ngàn hồ Đan Kia.',
        source: 'Sở VHTTDL Lâm Đồng & Gia Lai',
        tags: ['Hoa dã quỳ vàng rực', 'Đồi cỏ hồng', 'Núi lửa Chư Đăng Ya']
      },
      {
        region: 'Sơn La (Cao nguyên Mộc Châu)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Rừng hoa cải trắng và hoa tam giác mạch phủ trắng bạt ngàn thung lũng Mộc Châu, tiết trời chớm đông se lạnh 12-18°C.',
        source: 'Cổng TT Du lịch Sơn La',
        tags: ['Hoa cải trắng bạt ngàn', 'Chớm đông se lạnh', 'Đồi chè Mộc Châu']
      },
      {
        region: 'Hà Nội & Ba Vì',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa dã quỳ nở vàng rực Vườn Quốc gia Ba Vì, thời tiết chớm đông khô ráo trong trẻo, không khí phố cổ mát mẻ.',
        source: 'Traveloka 2026 & VQG Ba Vì',
        tags: ['Dã quỳ Ba Vì', 'Chớm đông khô ráo', 'Phố cổ Hà Nội']
      },
      {
        region: 'Hà Giang (Đồng Văn, Mèo Vạc)',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Đỉnh cao Lễ hội Hoa Tam Giác Mạch, sắc tím hồng phủ kín chân đèo Mã Pí Lèng, sông Nho Quế màu ngọc bích tuyệt đẹp.',
        source: 'Traveloka 2026 & Sở VHTTDL Hà Giang',
        tags: ['Tam Giác Mạch đỉnh cao', 'Mã Pí Lèng', 'Sông Nho Quế ngọc bích']
      },
      {
        region: 'ĐBSCL (Cần Thơ, Sóc Trăng, Bến Tre)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Lễ hội Oóc Om Bóc & đua ghe Ngo truyền thống rộn rã sông nước Sóc Trăng, thời tiết phương Nam mát mẻ dễ chịu.',
        source: 'Sở VHTTDL Sóc Trăng',
        tags: ['Lễ hội đua ghe Ngo', 'Oóc Om Bóc', 'Sông nước Nam Bộ']
      },
      {
        region: 'Lào Cai (Sa Pa, Fansipan)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Trời lạnh rõ rệt (dưới 8°C), thích hợp săn mây sáng sớm trên đèo Ô Quy Hồ nhưng cần trang bị áo ấm dày và găng tay.',
        source: 'Traveloka 2026',
        tags: ['Trời lạnh dưới 8°C', 'Săn mây Ô Quy Hồ', 'Chuẩn bị áo ấm']
      },
      {
        region: 'Ninh Bình & Quảng Ninh (Vịnh Hạ Long)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Khô ráo ít mưa nhưng thời tiết se lạnh 16-20°C, thích hợp du lịch ngắm cảnh thư thái hơn là tắm biển.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Khô ráo se lạnh', 'Du ngoạn thư thái', 'Không tắm biển']
      },
      {
        region: 'Đà Nẵng & Hội An',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mưa bão miền Trung giảm dần nhưng biển còn động nhẹ, thích hợp nghỉ dưỡng tĩnh lặng phố cổ hơn là tắm biển.',
        source: 'Traveloka 2026 & TTXTDL Đà Nẵng',
        tags: ['Mưa giảm dần', 'Nghỉ dưỡng phố cổ', 'Biển còn động nhẹ']
      },
      {
        region: 'Khánh Hòa (Nha Trang)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Vẫn còn mưa rào cuối mùa, biển có lúc sóng lớn, nên chọn các khu nghỉ dưỡng có hồ bơi nước ấm.',
        source: 'Sở Du lịch Khánh Hòa',
        tags: ['Mưa rào cuối mùa', 'Nghỉ dưỡng hồ bơi']
      },
      {
        region: 'Vùng trũng lũ hạ lưu sông miền Trung khi có áp thấp muộn',
        macroRegion: 'trung',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Cần theo dõi chặt chẽ cảnh báo ngập lụt vùng ven sông hạ lưu Thừa Thiên Huế, Quảng Nam khi có các đợt áp thấp muộn.',
        source: 'Trung tâm Dự báo KTTV Quốc gia',
        tags: ['Áp thấp muộn', 'Vùng trũng ven sông', 'Cảnh giác ngập úng']
      }
    ]
  },
  {
    month: 12,
    title: 'Tháng 12 - Mùa Lễ Hội Giáng Sinh, Chào Năm Mới & Săn Băng Tuyết Phương Bắc',
    seasonName: 'Mùa đông lạnh giá miền Bắc & Lễ hội cuối năm rực rỡ miền Nam',
    generalAdvice: 'Miền Bắc đón rét đậm, săn băng tuyết đỉnh Fansipan; miền Nam tưng bừng lễ hội Giáng sinh và Countdown năm mới trong tiết trời mát lành khô ráo.',
    destinations: [
      {
        region: 'TP. Hồ Chí Minh & Tây Ninh',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Không khí Giáng sinh và Countdown năm mới rộn ràng khắp Quận 1, phố đi bộ Nguyễn Huệ, Nhà thờ Đức Bà trong tiết trời mát 20-30°C.',
        source: 'Cổng TT Du lịch TP.HCM & VnExpress',
        tags: ['Giáng sinh rực rỡ', 'Countdown năm mới', 'Thời tiết mát 20°C']
      },
      {
        region: 'Kiên Giang (Phú Quốc) & Bà Rịa - Vũng Tàu',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Thiên đường nghỉ dưỡng đón năm mới trên bãi biển, hoàng hôn Bãi Dài lộng lẫy, biển êm như gương, lặn ngắm san hô.',
        source: 'Traveloka 2026',
        tags: ['Nghỉ dưỡng biển', 'Hoàng hôn đỉnh cao', 'Tiệc countdown biển']
      },
      {
        region: 'Lâm Đồng (Đà Lạt)',
        macroRegion: 'tay-nguyen',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'MÙA FESTIVAL HOA ĐÀ LẠT: Triển lãm hoa muôn sắc, đồi cỏ hồng bạt ngàn hồ Đan Kia, thời tiết đêm lạnh 11-15°C lý tưởng nướng than hồng.',
        source: 'Sở Du lịch Lâm Đồng & Festival Hoa 2026',
        tags: ['Festival Hoa Đà Lạt', 'Đồi cỏ hồng', 'Đêm lạnh nướng than']
      },
      {
        region: 'Sơn La (Mộc Châu) & Hà Giang',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Mùa hoa cải trắng nở muộn, hoa đào Pháp chớm nở trong tiết trời đông vùng cao, thung lũng mờ ảo trong sương sớm.',
        source: 'Cổng TT Du lịch Sơn La',
        tags: ['Hoa cải trắng', 'Hoa đào Pháp', 'Sương sớm vùng cao']
      },
      {
        region: 'ĐBSCL (Sa Đéc, Cần Thơ, Tiền Giang)',
        macroRegion: 'nam',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Làng hoa Sa Đéc bắt đầu vào vụ chăm hoa đón Tết, thời tiết mát mẻ dễ chịu, du thuyền sông nước miệt vườn.',
        source: 'Sở VHTTDL Đồng Tháp',
        tags: ['Vụ hoa Tết Sa Đéc', 'Thời tiết mát mẻ', 'Du thuyền sông nước']
      },
      {
        region: 'Hà Nội & Ninh Bình',
        macroRegion: 'bac',
        status: 'recommended',
        statusLabel: 'Nên đi',
        description: 'Trời rét ngọt khô ráo, ẩm thực phố cổ (lẩu riêu cua, đồ nướng vỉa hè) lên ngôi, cảnh sắc Tràng An tĩnh mịch thanh tịnh.',
        source: 'Traveloka 2026 & Báo Hà Nội Mới',
        tags: ['Rét ngọt khô ráo', 'Ẩm thực phố đêm', 'Tràng An thanh tịnh']
      },
      {
        region: 'Lào Cai (Fansipan, Sa Pa)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Rất lạnh (nhiệt độ có thể hạ xuống 0°C đến -2°C), cơ hội chiêm ngưỡng hiện tượng băng tuyết kỳ thú trên đỉnh Fansipan nhưng cần áo ấm chuyên dụng.',
        source: 'Traveloka 2026 & Sun World Fansipan Legend',
        tags: ['Săn băng tuyết', 'Rất lạnh dưới 0°C', 'Áo ấm chuyên dụng']
      },
      {
        region: 'Đà Nẵng, Huế & Quảng Nam',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mưa giảm nhiều, thời tiết se lạnh 19-23°C, phù hợp tham quan các bảo tàng, di tích lịch sử và thưởng thức ẩm thực cung đình Huế.',
        source: 'Traveloka 2026',
        tags: ['Se lạnh 20°C', 'Du lịch di tích', 'Ẩm thực cung đình']
      },
      {
        region: 'Quảng Ninh (Vịnh Hạ Long)',
        macroRegion: 'bac',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Mùa đông vịnh biển mờ ảo sương khói, khách quốc tế rất chuộng nghỉ dưỡng du thuyền Giáng sinh nhưng không tắm biển được.',
        source: 'Ban quản lý Vịnh Hạ Long',
        tags: ['Vịnh sương khói', 'Du thuyền Giáng sinh', 'Không tắm biển']
      },
      {
        region: 'Duyên hải Nam Trung Bộ (Quy Nhơn, Phú Yên)',
        macroRegion: 'trung',
        status: 'consider',
        statusLabel: 'Cân nhắc',
        description: 'Thời tiết mát mẻ, bớt mưa nhưng thỉnh thoảng có gió mùa Đông Bắc gây sóng biển vừa, thích hợp ngắm cảnh đất liền.',
        source: 'Sở Du lịch Bình Định',
        tags: ['Gió mùa Đông Bắc', 'Ngắm cảnh đất liền']
      },
      {
        region: 'Trekking các đỉnh núi cao hiểm trở khi có rét hại đóng băng đường',
        macroRegion: 'bac',
        status: 'avoid',
        statusLabel: 'Nên tránh',
        description: 'Hiện tượng băng giá phủ mặt đường dốc núi trơn trượt cực kỳ nguy hiểm, nguy cơ hạ thân nhiệt nếu không có trang thiết bị chuyên dụng và dẫn đường.',
        source: 'Cẩm nang Cứu hộ Cứu nạn Quốc gia',
        tags: ['Rét hại cực đoan', 'Băng giá đường dốc', 'Tránh leo núi tự do']
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// REGISTRY DỮ LIỆU ĐỊA LÝ 63 TỈNH THÀNH / VÙNG DU LỊCH VIỆT NAM
// Nguồn: Wikipedia tiếng Việt & Tổng cục Du lịch Việt Nam
// ─────────────────────────────────────────────────────────────
export const VIETNAM_GEO_REGIONS = [
  {
    id: 'tay-bac',
    name: 'Tây Bắc Bộ',
    code: 'NW',
    color: '#0284c7',
    description: 'Vùng núi non trùng điệp với đỉnh Fansipan 3.143m - nóc nhà Đông Dương, những cung đèo huyền thoại và bản sắc văn hóa các dân tộc H’Mông, Thái, Dao.',
    provinces: [
      {
        id: 'lao-cai',
        name: 'Lào Cai',
        capital: 'TP. Lào Cai',
        bestSeason: 'Tháng 9 - 11 (Lúa chín & Dã quỳ), Tháng 12 - 2 (Săn tuyết, hoa đào)',
        wikiSummary: 'Lào Cai là tỉnh miền núi biên giới phía Bắc, nổi tiếng toàn cầu với khu du lịch quốc gia Sa Pa, đỉnh Fansipan kỳ vĩ, thung lũng Mường Hoa và chợ phiên Bắc Hà.',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
        highlights: ['Đỉnh Fansipan 3.143m', 'Bản Cát Cát', 'Đèo Ô Quy Hồ', 'Thung lũng Mường Hoa', 'Núi Hàm Rồng'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/L%C3%A0o_Cai',
        matchingDistricts: ['Lào Cai', 'Sa Pa']
      },
      {
        id: 'ha-giang',
        name: 'Hà Giang',
        capital: 'TP. Hà Giang',
        bestSeason: 'Tháng 10 - 12 (Hoa tam giác mạch), Tháng 9 (Lúa chín Hoàng Su Phì)',
        wikiSummary: 'Cực Bắc của Tổ quốc nơi có Công viên địa chất toàn cầu Cao nguyên đá Đồng Văn, đèo Mã Pí Lèng hiểm trở, dòng sông Nho Quế ngọc bích và Cột cờ Lũng Cú.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        highlights: ['Cột cờ Quốc gia Lũng Cú', 'Đèo Mã Pí Lèng', 'Sông Nho Quế', 'Phố cổ Đồng Văn', 'Dinh Thự Họ Vương'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/H%C3%A0_Giang',
        matchingDistricts: ['Hà Giang', 'Đồng Văn']
      },
      {
        id: 'son-la',
        name: 'Sơn La',
        capital: 'TP. Sơn La',
        bestSeason: 'Tháng 1 - 2 (Hoa mận trắng), Tháng 11 (Cải trắng Mộc Châu)',
        wikiSummary: 'Sơn La sở hữu cao nguyên Mộc Châu trù phú bạt ngàn đồi chè xanh mướt, thung lũng mận Nà Ka và nhà máy thủy điện Sơn La lớn nhất Đông Nam Á.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
        highlights: ['Cao nguyên Mộc Châu', 'Thác Dải Yếm', 'Thung lũng mận Nà Ka', 'Đồi chè Trái Tim'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/S%C6%A1n_La',
        matchingDistricts: ['Mộc Châu', 'Sơn La']
      },
      {
        id: 'dien-bien',
        name: 'Điện Biên',
        capital: 'TP. Điện Biên Phủ',
        bestSeason: 'Tháng 3 (Hoa ban nở & Kỷ niệm chiến thắng Điện Biên Phủ)',
        wikiSummary: 'Vùng đất lịch sử vang danh thế giới với Quần thể di tích chiến trường Điện Biên Phủ lừng lẫy năm châu, chấn động địa cầu năm 1954.',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
        highlights: ['Đồi A1', 'Hầm Đờ-cát', 'Bảo tàng Chiến thắng Điện Biên Phủ', 'Hồ Pá Khoang'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/%C4%90i%E1%BB%87n_Bi%C3%AAn',
        matchingDistricts: ['Điện Biên']
      }
    ]
  },
  {
    id: 'dong-bang-song-hong',
    name: 'Đồng bằng Sông Hồng & Thủ đô',
    code: 'RRD',
    color: '#0284c7',
    description: 'Cái nôi văn hiến ngàn năm của dân tộc Việt Nam với thủ đô Hà Nội cổ kính, di sản thế giới Quần thể danh thắng Tràng An và Vịnh Hạ Long.',
    provinces: [
      {
        id: 'ha-noi',
        name: 'Hà Nội',
        capital: 'Thủ đô Hà Nội',
        bestSeason: 'Tháng 9 - 11 (Thu Hà Nội nồng nàn hoa sữa), Tháng 1 - 3 (Xuân se lạnh)',
        wikiSummary: 'Thủ đô ngàn năm văn hiến của Việt Nam, trung tâm chính trị, văn hóa, giáo dục và khoa học lớn nhất cả nước, nổi danh với 36 phố phường, Hồ Gươm và Văn Miếu - Quốc Tử Giám.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        highlights: ['Hồ Hoàn Kiếm (Hồ Gươm)', 'Văn Miếu Quốc Tử Giám', 'Phố cổ Hà Nội 36 phố phường', 'Lăng Chủ tịch Hồ Chí Minh', 'Chùa Trấn Quốc'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/H%C3%A0_N%E1%BB%99i',
        matchingDistricts: ['Hà Nội', 'Hoàn Kiếm', 'Ba Đình']
      },
      {
        id: 'ninh-binh',
        name: 'Ninh Bình',
        capital: 'TP. Ninh Bình',
        bestSeason: 'Tháng 1 - 3 (Lễ hội Bái Đính), Tháng 5 - 6 (Mùa lúa vàng Tam Cốc)',
        wikiSummary: 'Cố đô Hoa Lư lịch sử, sở hữu Di sản kép Văn hóa và Thiên nhiên thế giới Quần thể danh thắng Tràng An, Tam Cốc - Bích Động và quần thể chùa Bái Đính nguy nga.',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
        highlights: ['Danh thắng Tràng An', 'Tam Cốc - Bích Động', 'Chùa Bái Đính', 'Hang Múa', 'Cố đô Hoa Lư'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Ninh_B%C3%ACnh',
        matchingDistricts: ['Ninh Bình', 'Hoa Lư']
      },
      {
        id: 'quang-ninh',
        name: 'Quảng Ninh',
        capital: 'TP. Hạ Long',
        bestSeason: 'Tháng 4 - 8 (Tắm biển & Du thuyền vịnh), Tháng 9 - 11 (Thu mát)',
        wikiSummary: 'Quảng Ninh tự hào sở hữu Kỳ quan thiên nhiên thế giới Vịnh Hạ Long với hàng nghìn hòn đảo đá vôi kỳ vĩ cùng khu danh thắng tâm linh Yên Tử non thiêng.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
        highlights: ['Vịnh Hạ Long', 'Danh thắng Yên Tử', 'Đảo Cô Tô', 'Bán đảo Tuần Châu', 'Bảo tàng Quảng Ninh'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Qu%E1%BA%A3ng_Ninh',
        matchingDistricts: ['Hạ Long', 'Quảng Ninh']
      }
    ]
  },
  {
    id: 'mien-trung',
    name: 'Bắc Trung Bộ & Duyên hải Miền Trung',
    code: 'CSC',
    color: '#0284c7',
    description: 'Vùng đất di sản văn hóa thế giới với Cố đô Huế, Phố cổ Hội An, Thánh địa Mỹ Sơn, những vịnh biển tuyệt sắc và ẩm thực đậm đà bản sắc.',
    provinces: [
      {
        id: 'da-nang',
        name: 'Đà Nẵng',
        capital: 'TP. Đà Nẵng',
        bestSeason: 'Tháng 2 - 7 (Biển êm nắng ấm, Lễ hội pháo hoa quốc tế DIFF)',
        wikiSummary: 'Thành phố đáng sống bậc nhất Việt Nam, sở hữu bãi biển Mỹ Khê quyến rũ, cây Cầu Vàng trên đỉnh Bà Nà Hills, bán đảo Sơn Trà và danh thắng Ngũ Hành Sơn.',
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=80',
        highlights: ['Cầu Vàng Bà Nà Hills', 'Biển Mỹ Khê', 'Bán đảo Sơn Trà & Chùa Linh Ứng', 'Cầu Rồng phun lửa', 'Ngũ Hành Sơn'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/%C4%90%C3%A0_N%E1%BA%B5ng',
        matchingDistricts: ['Đà Nẵng', 'Sơn Trà', 'Ngũ Hành Sơn']
      },
      {
        id: 'thua-thien-hue',
        name: 'Thừa Thiên Huế',
        capital: 'TP. Huế',
        bestSeason: 'Tháng 1 - 4 (Mát mẻ khô ráo, Festival Huế)',
        wikiSummary: 'Kinh đô phong kiến cuối cùng của triều Nguyễn, lưu giữ Di sản Văn hóa Thế giới Quần thể Di tích Cố đô Huế, Nhã nhạc cung đình và dòng sông Hương thơ mộng.',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80',
        highlights: ['Đại Nội Huế (Hoàng thành)', 'Chùa Thiên Mụ', 'Lăng Khải Định & Tự Đức', 'Sông Hương & Cầu Tràng Tiền', 'Phá Tam Giang'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Th%E1%BB%ABa_Thi%C3%AAn_Hu%E1%BA%BF',
        matchingDistricts: ['Huế', 'Thừa Thiên Huế']
      },
      {
        id: 'quang-nam',
        name: 'Quảng Nam (Hội An)',
        capital: 'TP. Tam Kỳ',
        bestSeason: 'Tháng 2 - 5 (Trời khô ráo, phố cổ rợp lồng đèn)',
        wikiSummary: 'Nơi giao thoa văn hóa Đông - Tây với Di sản văn hóa thế giới Đô thị cổ Hội An rực rỡ đèn lồng bên sông Hoài và Quần thể thánh địa Chăm Pa Mỹ Sơn.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
        highlights: ['Chùa Cầu Hội An', 'Sông Hoài lung linh hoa đăng', 'Làng gốm Thanh Hà', 'Thánh địa Mỹ Sơn', 'Đảo Cù Lao Chàm'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Qu%E1%BA%A3ng_Nam',
        matchingDistricts: ['Hội An', 'Quảng Nam']
      },
      {
        id: 'khanh-hoa',
        name: 'Khánh Hòa (Nha Trang)',
        capital: 'TP. Nha Trang',
        bestSeason: 'Tháng 1 - 8 (Mùa khô chan hòa ánh nắng, biển trong xanh)',
        wikiSummary: 'Xứ trầm hương biển yến, sở hữu Vịnh Nha Trang nằm trong top các vịnh biển đẹp nhất thế giới, thiên đường lặn biển và tháp bà Ponagar nghìn năm tuổi.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        highlights: ['Vịnh Nha Trang', 'Tháp Bà Ponagar', 'Đảo Hòn Mun', 'VinWonders Nha Trang', 'Viện Hải dương học'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Kh%C3%A1nh_H%C3%B2a',
        matchingDistricts: ['Nha Trang', 'Khánh Hòa']
      }
    ]
  },
  {
    id: 'tay-nguyen',
    name: 'Tây Nguyên Đại Ngàn',
    code: 'CH',
    color: '#0284c7',
    description: 'Xứ sở của cồng chiêng di sản thế giới, những đồi chè, rừng thông reo ngút ngàn và khí hậu quanh năm se mát tại xứ sở sương mù Đà Lạt.',
    provinces: [
      {
        id: 'lam-dong',
        name: 'Lâm Đồng (Đà Lạt)',
        capital: 'TP. Đà Lạt',
        bestSeason: 'Tháng 11 - 4 (Mùa khô se lạnh, mùa hoa dã quỳ, phượng tím, anh đào)',
        wikiSummary: 'Nằm trên cao nguyên Lâm Viên độ cao 1.500m, Đà Lạt là thành phố ngàn hoa với khí hậu ôn đới quanh năm, kiến trúc biệt thự Pháp cổ kính và ngàn đồi thông reo.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        highlights: ['Hồ Xuân Hương', 'Quảng trường Lâm Viên', 'Thung lũng Tình Yêu', 'Đỉnh Langbiang', 'Chợ đêm Đà Lạt'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/L%C3%A2m_%C4%90%E1%BB%93ng',
        matchingDistricts: ['Đà Lạt', 'Lâm Đồng']
      },
      {
        id: 'dak-lak',
        name: 'Đắk Lắk (Buôn Ma Thuột)',
        capital: 'TP. Buôn Ma Thuột',
        bestSeason: 'Tháng 12 - 3 (Mùa hoa cà phê trắng đồi, Lễ hội Cà phê)',
        wikiSummary: 'Thủ phủ cà phê của Việt Nam, nổi tiếng với không gian văn hóa cồng chiêng Tây Nguyên, bản sắc người Ê Đê và Vườn quốc gia Yok Đôn hùng vĩ.',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
        highlights: ['Bảo tàng Thế giới Cà phê', 'Thác Dray Nur & Dray Sap', 'Hồ Lắk', 'Buôn Đôn'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/%C4%90%E1%BA%AFk_L%E1%BA%AFk',
        matchingDistricts: ['Buôn Ma Thuột', 'Đắk Lắk']
      }
    ]
  },
  {
    id: 'dong-nam-bo',
    name: 'Đông Nam Bộ & TP. Hồ Chí Minh',
    code: 'SE',
    color: '#0284c7',
    description: 'Trung tâm kinh tế năng động bậc nhất Việt Nam, kết hợp di tích lịch sử trăm năm, quần thể danh thắng tâm linh Núi Bà Đen và biển Vũng Tàu rực nắng.',
    provinces: [
      {
        id: 'ho-chi-minh',
        name: 'TP. Hồ Chí Minh',
        capital: 'TP. Hồ Chí Minh',
        bestSeason: 'Tháng 11 - 4 (Mùa khô nắng ấm, độ ẩm dịu, thời tiết rực rỡ nhất)',
        wikiSummary: 'Đô thị đặc biệt và đầu tàu kinh tế của Việt Nam. Nơi hội tụ tinh hoa văn hóa, lịch sử và ẩm thực với các biểu tượng Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Sài Gòn, Chợ Bến Thành và địa đạo Củ Chi.',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80',
        highlights: ['Dinh Độc Lập', 'Bưu điện Trung tâm Sài Gòn', 'Chợ Bến Thành', 'Bảo tàng Chứng tích Chiến tranh', 'Phố đi bộ Nguyễn Huệ', 'Địa đạo Củ Chi', 'Chiến khu Rừng Sác Cần Giờ'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh',
        matchingDistricts: ['Quận 1', 'Quận 3', 'Quận 5', 'TP. Thủ Đức', 'Củ Chi', 'Cần Giờ']
      },
      {
        id: 'ba-ria-vung-tau',
        name: 'Bà Rịa - Vũng Tàu',
        capital: 'TP. Bà Rịa / Vũng Tàu',
        bestSeason: 'Quanh năm (Lý tưởng nhất từ Tháng 11 - Tháng 5, biển lặng)',
        wikiSummary: 'Thành phố biển du lịch nổi tiếng phương Nam, nổi bật với ngọn Hải đăng cổ kính, Tượng Chúa Kytô Vua trên đỉnh Núi Nhỏ, Mũi Nghinh Phong và bờ biển Bãi Sau trải dài.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        highlights: ['Hải đăng Vũng Tàu', 'Tượng Chúa Kytô Vua', 'Mũi Nghinh Phong', 'Bãi Sau (Thùy Vân)', 'Bạch Dinh', 'Côn Đảo'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/B%C3%A0_R%E1%BB%8Ba_-_V%C5%A9ng_T%C3%A0u',
        matchingDistricts: ['Vũng Tàu', 'Bà Rịa', 'Côn Đảo']
      },
      {
        id: 'tay-ninh',
        name: 'Tây Ninh',
        capital: 'TP. Tây Ninh',
        bestSeason: 'Tháng 11 - 5 (Mùa khô, Lễ hội xuân Núi Bà, Hội Yến Diêu Trì Cung)',
        wikiSummary: 'Vùng đất địa linh nhân kiệt với Núi Bà Đen - Nóc nhà Nam Bộ cao 986m, Tòa thánh Cao Đài uy nghiêm và Hồ Dầu Tiếng mênh mông như biển hồ.',
        image: '/images/toa-thanh-tay-ninh.jpg',
        highlights: ['Quần thể Núi Bà Đen', 'Tượng Phật Bà Tây Bổ Đà Sơn', 'Tòa Thánh Tây Ninh', 'Hồ Dầu Tiếng', 'Thung lũng Ma Thiên Lãnh'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/T%C3%A2y_Ninh',
        matchingDistricts: ['Tây Ninh', 'Núi Bà Đen']
      },
      {
        id: 'binh-duong-dong-nai',
        name: 'Bình Dương & Đồng Nai',
        capital: 'TP. Thủ Dầu Một / Biên Hòa',
        bestSeason: 'Tháng 5 - 8 (Mùa trái cây Lái Thiêu), Tháng 11 - 4 (Sinh thái)',
        wikiSummary: 'Vùng đệm sinh thái và công nghiệp năng động, sở hữu Vườn Quốc gia Cát Tiên Di sản khu dự trữ sinh quyển thế giới, chùa núi Châu Thới và KDL Suối Mơ.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        highlights: ['Vườn Quốc gia Cát Tiên', 'KDL Suối Mơ', 'Chùa Châu Thới', 'Làng tre Phú An', 'Khu di tích Chiến khu Đ'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/%C4%90%E1%BB%93ng_Nai',
        matchingDistricts: ['Bình Dương', 'Đồng Nai']
      }
    ]
  },
  {
    id: 'dong-bang-song-cuu-long',
    name: 'Đồng bằng Sông Cửu Long & Đảo Ngọc',
    code: 'MRD',
    color: '#0284c7',
    description: 'Miền sông nước chín rồng trù phú, những chợ nổi tấp nập sớm mai, miệt vườn trái cây trĩu quả và đảo ngọc Phú Quốc biển xanh cát trắng.',
    provinces: [
      {
        id: 'kien-giang',
        name: 'Kiên Giang (Phú Quốc)',
        capital: 'TP. Rạch Giá',
        bestSeason: 'Tháng 11 - 4 (Mùa khô hoàn hảo, biển êm như mặt gương)',
        wikiSummary: 'Kiên Giang sở hữu Phú Quốc - Thành phố đảo đầu tiên của Việt Nam và hòn đảo ngọc du lịch tầm cỡ quốc tế với Bãi Sao, Grand World và cáp treo Hòn Thơm vượt biển.',
        image: '/images/phu-quoc-sunset-kiss-bridge.jpg',
        highlights: ['Đảo ngọc Phú Quốc', 'Bãi Sao cát trắng', 'Cáp treo Hòn Thơm', 'Grand World Phú Quốc', 'Vườn Quốc gia Phú Quốc'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Ki%C3%AAn_Giang',
        matchingDistricts: ['Phú Quốc', 'Kiên Giang']
      },
      {
        id: 'tien-giang',
        name: 'Tiền Giang',
        capital: 'TP. Mỹ Tho',
        bestSeason: 'Quanh năm (Đặc biệt mùa trái cây Tháng 5 - 9 & Mùa xuân)',
        wikiSummary: 'Cửa ngõ miền Tây Nam Bộ, nổi tiếng với cù lao Thới Sơn rợp bóng dừa nước, Chợ nổi Cái Bè trên sông Tiền và ngôi chùa cổ Vĩnh Tràng bề thế.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        highlights: ['Cù Lao Thới Sơn', 'Chợ nổi Cái Bè', 'Chùa Vĩnh Tràng', 'Trại rắn Đồng Tâm', 'Cồn Lân & Cồn Phụng'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/Ti%E1%BB%81n_Giang',
        matchingDistricts: ['Tiền Giang', 'Mỹ Tho', 'Cái Bè']
      },
      {
        id: 'can-tho',
        name: 'Cần Thơ',
        capital: 'TP. Cần Thơ',
        bestSeason: 'Tháng 9 - 11 (Mùa nước nổi), Tháng 12 - 4 (Mùa khô ráo mát mẻ)',
        wikiSummary: 'Đô thị trung tâm Tây Đô, nổi tiếng với Chợ nổi Cái Răng tấp nập thuyền bè lúc tờ mờ sáng, Bến Ninh Kiều thi vị và những vườn cây ăn trái sum suê.',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
        highlights: ['Chợ nổi Cái Răng', 'Bến Ninh Kiều & Cầu Đi Bộ', 'Nhà cổ Bình Thủy', 'Vườn cò Bằng Lăng', 'Cồn Sơn'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/C%E1%BA%A7n_Th%C6%A1',
        matchingDistricts: ['Cần Thơ', 'Ninh Kiều']
      },
      {
        id: 'ca-mau',
        name: 'Cà Mau',
        capital: 'TP. Cà Mau',
        bestSeason: 'Tháng 12 - 4 (Mùa khô ráo tham quan Đất Mũi)',
        wikiSummary: 'Điểm cực Nam thiêng liêng của Tổ quốc, nơi có Vườn Quốc gia Mũi Cà Mau, Cột mốc tọa độ Quốc gia GPS 0001 và rừng đước ngập mặn lớn nhất Việt Nam.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        highlights: ['Cột mốc Tọa độ Quốc gia Mũi Cà Mau', 'Vườn Quốc gia U Minh Hạ', 'Hòn Đá Bạc', 'Rừng đước Năm Căn'],
        wikiUrl: 'https://vi.wikipedia.org/wiki/C%C3%A0_Mau',
        matchingDistricts: ['Cà Mau', 'Đất Mũi']
      }
    ]
  }
];
