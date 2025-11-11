import type { SegmentedProps } from 'antd';
import { Segmented } from 'antd';

interface CustomSegmentedProps {
  currentView: SegmentedProps['value'];
  onChange: SegmentedProps['onChange'];
  options: SegmentedProps['options'];
}

export const CustomSegmented: React.FC<CustomSegmentedProps> = ({
  currentView,
  onChange,
  options,
}) => {
  return (
    <Segmented value={currentView} onChange={onChange} options={options} />
  );
};
