import React, { useEffect, useRef, useState, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import styles from './slider.module.scss';
import { TimelineEvent } from "../../entities/Timeline/data";
import "swiper/css/navigation";
import "swiper/css";
import "./arrows.css";

const MOBILE_BREAKPOINT = '500px';
const MOBILE_SPACE = 25;
const DESKTOP_SPACE = 80;

interface SliderProps {
    events: TimelineEvent[];
    isAnimating: boolean;
}

const generateUniqueId = () => `custom-${Math.random().toString(36).slice(2, 9)}`;

export const Slider = memo<SliderProps>(({ events, isAnimating }) => {
    const [isFirstSlide, setIsFirstSlide] = useState<boolean>(true);
    const [isLastSlide, setIsLastSlide] = useState<boolean>(false);
    const swiperInstance = useRef<SwiperType>(null);

    const isSmallScreen = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT})`).matches;
    const sliderId = generateUniqueId();
    const prevButtonId = `prev-${sliderId}`;
    const nextButtonId = `next-${sliderId}`;

    const handleSwiperInit = (swiper: SwiperType): void => {
        swiperInstance.current = swiper;
        updateSlidePositions(swiper);
    };

    const updateSlidePositions = (swiper: SwiperType): void => {
        setIsFirstSlide(swiper.isBeginning);
        setIsLastSlide(swiper.isEnd);
    };

    useEffect(() => {
        swiperInstance.current?.slideTo(0);
    }, [events]);

    const navigationConfig = {
        prevEl: `#${prevButtonId}`,
        nextEl: `#${nextButtonId}`,
    };

    const swiperConfig = {
        modules: [Navigation],
        navigation: navigationConfig,
        slidesPerView: "auto" as "auto",
        spaceBetween: isSmallScreen ? MOBILE_SPACE : DESKTOP_SPACE,
        resistanceRatio: 0,
        freeMode: true,
        className: `${styles.container} ${isAnimating ? styles.animated : ''}`,
        onSwiper: handleSwiperInit,
        onSlideChange: () => updateSlidePositions(swiperInstance.current!),
    };

    return (
        <div className={styles.slider}>
            <button
                id={prevButtonId}
                className={`customPrev ${isFirstSlide ? styles.hidden : ""} ${isAnimating ? styles.animated : ''}`}
            >
                &lt;
            </button>

            <Swiper {...swiperConfig}>
                {events.map((event, index) => (
                    <SwiperSlide key={index} className={styles.slide}>
                        <div className={styles.year}>{event.year}</div>
                        <div className={styles.description}>{event.description}</div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                id={nextButtonId}
                className={`customNext ${isLastSlide ? styles.hidden : ""} ${isAnimating ? styles.animated : ''}`}
            >
                &gt;
            </button>
        </div>
    );
});

Slider.displayName = 'Slider';