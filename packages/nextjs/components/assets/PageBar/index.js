import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function PageBar(props) {
  return (
    <div className={`page-bar flex justify-between gap-x-2.5 ${props.className || ''}`}>
      <img
        className="w-[105px] h-[57px] mb-[13px]"
        src={'/assets/9c373127aae276ecc6823207ab167dd0.png'}
        alt="alt text"
      />
      <img
        className="w-[122px] h-[57px] mb-[13px]"
        src={'/assets/e7b2a74b3fce302a14b025ca9eec1b5b.png'}
        alt="alt text"
      />
      <img className="w-[124px] h-[70px]" src={'/assets/90d5a2f422b03a08a11156990b555a87.png'} alt="alt text" />
      <img
        className="w-[96px] h-[57px] mb-[13px]"
        src={'/assets/8ec12af3cd0748c0b1b9d2b8c1fd21ed.png'}
        alt="alt text"
      />
    </div>
  );
}

PageBar.propTypes = {
  className: PropTypes.string
};

export default PageBar;
