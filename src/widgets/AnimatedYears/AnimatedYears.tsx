import { FC, RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TimelineCategory } from "../../entities/Timeline/data";
import styles from './animatedYears.module.scss';

interface AnimatedYearsProps {
    currentPeriodData: TimelineCategory;
}

const ANIMATION_DURATION = 1;

interface AnimationConfig {
    ref: RefObject<HTMLElement>;
    startValue: number;
    endValue: number;
}

const AnimatedYears: FC<AnimatedYearsProps> = ({ currentPeriodData }) => {
    const startYearElement = useRef(null);
    const endYearElement = useRef(null);
    const previousStartYear = useRef(currentPeriodData.startYear);
    const previousEndYear = useRef(currentPeriodData.finishYear);

    const animateNumberTransition = ({ ref, startValue, endValue }: AnimationConfig): void => {
        const counter = { value: Math.round(startValue) };
        const targetValue = Math.round(endValue);

        gsap.to(counter, {
            value: targetValue,
            duration: ANIMATION_DURATION,
            ease: "none",
            onUpdate: () => {
                if (ref.current) {
                    ref.current.textContent = Math.round(counter.value).toString();
                }
            }
        });
    };

    useEffect(() => {
        const { startYear, finishYear } = currentPeriodData;

        if (previousStartYear.current !== startYear) {
            animateNumberTransition({
                ref: startYearElement,
                startValue: previousStartYear.current,
                endValue: startYear
            });
            previousStartYear.current = startYear;
        }

        if (previousEndYear.current !== finishYear) {
            animateNumberTransition({
                ref: endYearElement,
                startValue: previousEndYear.current,
                endValue: finishYear
            });
            previousEndYear.current = finishYear;
        }
    }, [currentPeriodData]);

    return (
        <div className={styles.years}>
            <p className={styles.startYear} ref={startYearElement}>
                {currentPeriodData.startYear}
            </p>
            <p className={styles.endYear} ref={endYearElement}>
                {currentPeriodData.finishYear}
            </p>
        </div>
    );
};

export default AnimatedYears;