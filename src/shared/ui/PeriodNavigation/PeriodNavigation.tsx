
import cls from './periodNavigation.module.scss';

interface PeriodNavigationProps {
    isMobile: boolean;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    activeIndex: number;
    handleClick: (index: number) => void;
}

const PeriodNavigation: React.FC<PeriodNavigationProps> = ({
                                                               isMobile,
                                                               isNextDisabled,
                                                               isPrevDisabled,
                                                               activeIndex,
                                                               handleClick
                                                           }) => {
    return (
        <div className={cls.navArrow}>
            <svg
                onClick={() => !isNextDisabled && handleClick(activeIndex + 1)}
                className={isNextDisabled ? cls.disabled : ''}
                width={isMobile ? 25 : 50}
                height={isMobile ? 25 : 50}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="24.5"
                    transform="matrix(-1 0 0 1 50 0)"
                    stroke="#42567A"
                    strokeOpacity="0.5"
                />
                <path
                    d="M27.4999 18.75L21.2499 25L27.4999 31.25"
                    stroke="#42567A"
                    strokeWidth="2"
                />
            </svg>
            <svg
                onClick={() => !isPrevDisabled && handleClick(activeIndex - 1)}
                className={isPrevDisabled ? cls.disabled : ''}
                width={isMobile ? 25 : 50}
                height={isMobile ? 25 : 50}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="24.5"
                    transform="matrix(-1 0 0 1 50 0)"
                    stroke="#42567A"
                    strokeOpacity="0.5"
                />
                <path
                    d="M27.4999 18.75L21.2499 25L27.4999 31.25"
                    stroke="#42567A"
                    strokeWidth="2"
                    transform="scale(-1, 1) translate(-50, 0)"
                />
            </svg>
        </div>
    );
};

export default PeriodNavigation;