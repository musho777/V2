import React from 'react';

import type { SliderSingleProps } from 'antd';
import { Col, Row, Slider } from 'antd';

interface SliderComponentProps {
  value: number;
  width?: number;
  handleLineWidthHover?: string | number;
  handleActiveColor?: string;
  handleActiveOutlineColor?: string;
  handleColor?: string;
  handleColorDisabled?: string;
  handleLineWidth?: string | number;
  trackBg?: string;
  trackBgDisabled?: string;
  onChange: (value: number) => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({
  value,
  onChange,
  width = 200,
}) => {
  return (
    <Row>
      <Col flex={`0 0 ${`${width}px`}`}>
        <Slider
          min={1}
          max={100}
          onChange={onChange}
          value={typeof value === 'number' ? value : 0}
        />
      </Col>
    </Row>
  );
};
export default SliderComponent;
