import { Paper } from '@mui/material';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useHomePromos } from '../../application/queries';
import HomeArenaPromoCard from './promos/HomeArenaPromoCard';
import HomeBlogCreatePromoCard from './promos/HomeBlogCreatePromoCard';
import HomeContestPromoCard from './promos/HomeContestPromoCard';
import HomeKepCoverPromoCard from './promos/HomeKepCoverPromoCard';
import 'swiper/css';
import 'swiper/css/pagination';

const HomePromosSection = () => {
  const { data: slides } = useHomePromos();

  if (!slides?.length) {
    return null;
  }

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        slidesPerView={1}
        autoHeight
        pagination={{ clickable: true }}
        autoplay={
          slides.length > 1
            ? {
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
                delay: 5000,
              }
            : false
        }
        loop={slides.length > 1}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.type === 'blogCreate' ? <HomeBlogCreatePromoCard slide={slide} /> : null}
            {slide.type === 'kepCover' ? <HomeKepCoverPromoCard slide={slide} /> : null}
            {slide.type === 'contest' ? <HomeContestPromoCard slide={slide} /> : null}
            {slide.type === 'arena' ? <HomeArenaPromoCard slide={slide} /> : null}
          </SwiperSlide>
        ))}
      </Swiper>
    </Paper>
  );
};

export default HomePromosSection;
