import React, { useState } from 'react';
import { Button, ButtonType } from './Button';

const Topic = ({ topic, toggleTopic, enabled, selected }) => {
  return (
    <Button
      text={topic}
      enabled={enabled}
      onClick={() => toggleTopic(topic)}
      type={selected ? ButtonType.Fill : ButtonType.Outline}

    />
  )
}

export default Topic;