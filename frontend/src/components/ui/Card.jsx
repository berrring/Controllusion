import { cx } from '../../utils/formatters';

function Card({ children, className }) {
  return <div className={cx('surface-card panel-outline p-5 sm:p-6', className)}>{children}</div>;
}

export default Card;
