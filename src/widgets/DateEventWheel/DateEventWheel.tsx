import styles from './dateEventWheel.module.scss';
import { Slider } from "../Slider/Slider";
import {FC, useEffect, useRef, useState} from "react";
import { timeline, TimelineCategory } from "../../entities/Timeline/data";
import { gsap } from "gsap";
import AnimatedYears from "../AnimatedYears/AnimatedYears";
import PeriodNavigation from "../../shared/ui/PeriodNavigation/PeriodNavigation";

// Constants
const WHEEL_RADIUS = 265;
const INITIAL_PERIOD_INDEX = 5;
const MOBILE_BREAKPOINT = '500px';
const DEGREES_MULTIPLIER = 6;
const ANIMATION_DURATION = 1;

interface Point {
    x: number;
    y: number;
}

interface DateEventWheelProps {
    timeline: TimelineCategory[];
}

const DateEventWheel: FC<DateEventWheelProps> = ({ timeline }) => {
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(INITIAL_PERIOD_INDEX);
    const wheelRef = useRef<HTMLDivElement>(null);
    const periodLabelsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const wheelRotationDegrees = useRef(0);
    const [activePeriod, setActivePeriod] = useState<TimelineCategory>();

    const isNextDisabled = selectedPeriodIndex >= timeline.length - 1;
    const isPrevDisabled = selectedPeriodIndex <= 0;
    const isSmallScreen = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT})`).matches;

    const calculatePeriodPosition = (index: number): Point => {
        const totalPeriods = timeline.length;
        if (totalPeriods === 0) return { x: 0, y: 0 };

        const angleOffset = (DEGREES_MULTIPLIER * 360) / totalPeriods;
        const angle = ((index * 360) / totalPeriods + angleOffset) * (Math.PI / 180);

        return {
            x: WHEEL_RADIUS + WHEEL_RADIUS * Math.cos(angle),
            y: WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(angle)
        };
    };

    const handleDesktopPeriodSelect = (index: number) => {
        const totalPeriods = timeline.length;
        const degreesPerPeriod = 360 / totalPeriods;

        const isClockwise = index > selectedPeriodIndex
            ? (index - selectedPeriodIndex) <= (totalPeriods / 2)
            : (selectedPeriodIndex - index) > (totalPeriods / 2);

        const periodOffset = isClockwise
            ? (index - selectedPeriodIndex + totalPeriods) % totalPeriods
            : (selectedPeriodIndex - index + totalPeriods) % totalPeriods;

        const targetRotationDegrees = isClockwise ? -periodOffset * degreesPerPeriod : periodOffset * degreesPerPeriod;

        wheelRotationDegrees.current += targetRotationDegrees;

        gsap.to(wheelRef.current, {
            rotation: wheelRotationDegrees.current,
            duration: ANIMATION_DURATION,
            ease: "power3.inOut",
            onStart: () => setIsAnimating(true),
            onComplete: () => setIsAnimating(false),
        });

        gsap.to(periodLabelsRefs.current, {
            rotation: -wheelRotationDegrees.current,
            duration: ANIMATION_DURATION,
            ease: "power3.inOut",
        });

        setSelectedPeriodIndex(index);
    };

    const handleMobilePeriodSelect = (index: number) => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            setSelectedPeriodIndex(index);
        }, 500);
    };

    const handlePeriodSelect = (index: number) => {
        if (timeline.length === 0) return;

        isSmallScreen
            ? handleMobilePeriodSelect(index)
            : handleDesktopPeriodSelect(index);
    };

    useEffect(() => {
        setActivePeriod(timeline.length > 0 ? timeline[selectedPeriodIndex] : undefined);
    }, [selectedPeriodIndex, timeline]);

    useEffect(() => {
        if (selectedPeriodIndex >= timeline.length) {
            setSelectedPeriodIndex(0);
        }
    }, [timeline, selectedPeriodIndex]);

    if (!activePeriod) {
        return <div>No data available</div>;
    }
    return (
        <div className={styles.categoryWheel}>
            <div className={styles.titleBlock}>
                {!isSmallScreen && <hr className={styles.gradientLine}/>}
                <p className={styles.title}>Исторические <br/> даты</p>
            </div>

            <AnimatedYears currentPeriodData={activePeriod}/>

            <div className={styles.periodNavigation}>
                <div className={styles.counter}>
                    <p>{timeline.length > 0 ? `0${activePeriod.id}` : '00'}</p>
                    /<p>0{timeline.length}</p>
                </div>
                <PeriodNavigation
                    isMobile={isSmallScreen}
                    isNextDisabled={isNextDisabled}
                    isPrevDisabled={isPrevDisabled}
                    activeIndex={selectedPeriodIndex}
                    handleClick={handlePeriodSelect}
                />
            </div>

            <div className={styles.slider}>
                <Slider
                    events={activePeriod.events}
                    isAnimating={isAnimating}
                />
            </div>

            <hr className={styles.horizontalLine}/>
            {!isSmallScreen && <hr className={styles.verticalLine}/>}

            {isSmallScreen ? (
                <div className={styles.mobilePeriodMarkers}>
                    {timeline.map((_, index: number) => {
                        const periodOffset = (index - selectedPeriodIndex + timeline.length) % timeline.length;
                        return (
                            <div
                                onClick={() => handlePeriodSelect(index)}
                                key={index}
                                className={`${styles.periodMarker} ${periodOffset === 0 ? styles.activePeriodMarker : ""}`}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className={styles.wheelContainer} ref={wheelRef}>
                    <div className={styles.circle}/>
                    {timeline.map((item, index: number) => {
                        const periodOffset = (index - selectedPeriodIndex + timeline.length) % timeline.length;
                        const { x, y } = calculatePeriodPosition(index);
                        return (
                            <div
                                onClick={() => handlePeriodSelect(index)}
                                key={index}
                                className={`${styles.periodMarker} ${periodOffset === 0 ? styles.activePeriodMarker : ""}`}
                                style={{ left: `${x}px`, top: `${y}px` }}
                            >
                                <div
                                    ref={el => periodLabelsRefs.current[index] = el}
                                    className={styles.periodLabel}
                                >
                                    <p className={styles.position}>{item.id}</p>
                                    <p className={`${styles.description} ${isAnimating ? styles.animated : ''}`}>
                                        {item.category}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DateEventWheel;