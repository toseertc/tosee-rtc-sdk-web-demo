import React from 'react';
import CX from 'classnames';
import _ from 'lodash'

import './index.less';

interface SettingsListItemProps {
  name: string;
  children: React.ReactNode;
  type?: 'white' | 'gray' ;
  style?: React.CSSProperties;
}

function SettingsListItem(props: SettingsListItemProps) {
  const {
    name, children, type, style,
  } = props;

  const wrapperStyle = _.assign({}, style)
  return (
    <div
      className={CX({
        'ts-web-test-app-settings-list-item-wrapper': true,
        'ts-web-test-app-settings-list-item-gray': type === 'gray',
      })}
      style={wrapperStyle}
    >
      <div className="label">{name}</div>
      <div className="component-wrapper">{children}</div>
    </div>
  );
}

SettingsListItem.defaultProps = {
  type: 'white',
  style: {},
}

export default SettingsListItem
