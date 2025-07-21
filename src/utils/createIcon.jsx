export const createIcon = ({
    index,
    rate = 5,
    hoverValue = 5,
    width = "24px",
    height = "24px",
    activeColor = "#001529",
    nonActiveColor = "#989898",
}) => {
    const fillColor =
        (hoverValue && hoverValue >= index) || (!hoverValue && rate >= index)
            ? activeColor
            : nonActiveColor;

    return (
        <svg
            height={height}
            width={width}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 51.792 51.792"
            xmlSpace="preserve"
            fill={fillColor}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                <g>
                    <path d="M29.716,6.035c2.109,6.492,9.352,11.754,16.177,11.754c6.826,0,7.883,3.252,2.36,7.264 c-5.521,4.012-8.288,12.526-6.179,19.017c2.109,6.492-0.658,8.502-6.18,4.49s-14.474-4.012-19.996,0s-8.289,2.002-6.18-4.49 c2.109-6.491-0.657-15.006-6.179-19.017c-5.523-4.012-4.466-7.264,2.36-7.264c6.825,0,14.067-5.262,16.177-11.754 C24.187-0.456,27.607-0.456,29.716,6.035z"></path>
                </g>
            </g>
        </svg>
    );
};

export const createAverageRate = ({
    index,
    rate,
    width = "24px",
    height = "24px",
    activeColor = "#001529",
    nonActiveColor = "#e5e7eb",
}) => {
    const fullFill = rate >= index;
    const partialFill = rate > index - 1 && rate < index;
    const fillPercentage = partialFill ? (rate % 1) * 100 : 0;

    return (
        <svg
            height={height}
            width={width}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 51.792 51.792"
            xmlSpace="preserve"
        >
            <defs>
                <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset={`${fillPercentage}%`} stopColor={activeColor} />
                    <stop offset={`${fillPercentage}%`} stopColor={nonActiveColor} />
                </linearGradient>
            </defs>
            <path
                fill={
                    fullFill
                        ? activeColor
                        : partialFill
                            ? `url(#grad-${index})`
                            : nonActiveColor
                }
                d="M29.716,6.035c2.109,6.492,9.352,11.754,16.177,11.754c6.826,0,7.883,3.252,2.36,7.264 c-5.521,4.012-8.288,12.526-6.179,19.017c2.109,6.492-0.658,8.502-6.18,4.49s-14.474-4.012-19.996,0s-8.289,2.002-6.18-4.49 c2.109-6.491-0.657-15.006-6.179-19.017c-5.523-4.012-4.466-7.264,2.36-7.264c6.825,0,14.067-5.262,16.177-11.754 C24.187-0.456,27.607-0.456,29.716,6.035z"
            ></path>
        </svg>
    );
};

export const SingleStar = ({
    width = "16px",
    height = "16px",
    color = "#001529",
}) => {
    return (
        <svg
            height={height}
            width={width}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 51.792 51.792"
            xmlSpace="preserve"
        >
            <path
                fill={color}
                d="M29.716,6.035c2.109,6.492,9.352,11.754,16.177,11.754c6.826,0,7.883,3.252,2.36,7.264 c-5.521,4.012-8.288,12.526-6.179,19.017c2.109,6.492-0.658,8.502-6.18,4.49s-14.474-4.012-19.996,0s-8.289,2.002-6.18-4.49 c2.109-6.491-0.657-15.006-6.179-19.017c-5.523-4.012-4.466-7.264,2.36-7.264c6.825,0,14.067-5.262,16.177-11.754 C24.187-0.456,27.607-0.456,29.716,6.035z"
            ></path>
        </svg>
    );
};
