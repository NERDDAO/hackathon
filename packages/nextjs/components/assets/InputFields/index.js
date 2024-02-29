import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function InputFields(props) {
  return (
    <div
      className={`input-fields flex flex-col bg-[image:var(--src)] bg-[center_center] bg-contain bg-no-repeat relative ${props.className ||
        ''}`}
      style={{ '--src': `url(${'/assets/b6c5926e1621c2c8d2af665a37e9ffaa.png'})` }}>
      <div className="flex flex-col w-[35px] relative mt-[-13px] mb-[13px] ml-[47.07%]">
        <img className="w-full relative" src={'/assets/96f7cf5619efa6f82103c584c3ceebe1.png'} alt="alt text" />
        <img
          className="w-[108px] h-[113px] absolute left-[-38px] bottom-[-39px]"
          src={'/assets/e0d9c9eb57cbf930060668149c532aba.png'}
          alt="alt text"
        />
      </div>

      <img
        className="w-[85px] h-[140px] absolute left-0 top-[-70px]"
        src={'/assets/fa34ef0a6cd4c3c6aec856309bcb040d.png'}
        alt="alt text"
      />
    </div>
  );
}

InputFields.propTypes = {
  className: PropTypes.string
};

export default InputFields;
