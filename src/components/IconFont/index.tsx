interface IIconFontProps extends React.SVGProps<SVGSVGElement> {
  icon: string;
}
export default (props: IIconFontProps) => {
  const { icon, ...attr } = props;
  return (
    <svg {...attr} className={`icon ${attr.className}`} aria-hidden="true">
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
};
