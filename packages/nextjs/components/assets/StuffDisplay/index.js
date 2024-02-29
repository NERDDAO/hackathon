import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function StuffDisplay(props) {
  return (
    <div className={`stuff-display flex flex-col items-center ${props.className || ''}`}>
      <div className="w-[96.67%] flex flex-col">
        <img className="w-[265px]" src={'/assets/a9bc47159c4f1abe7f05453abccb8053.png'} alt="alt text" />

        <div className="flex justify-between gap-x-2.5 ml-[35px]">
          <div className="flex flex-col w-[230px] relative mt-7">
            <img className="w-full relative" src={props.nerdMon} alt="alt text" />
            <img className="w-44 h-52 absolute right-[-154px] top-0" src={props.dataSho} alt="alt text" />
          </div>

          <div className="flex flex-col w-[234px] relative min-h-[250px]">
            <div className="w-[225px] h-[238px] flex flex-col items-center absolute left-0 top-3">
              <img className="w-[86.67%]" src={props.funScores} alt="alt text" />
              <img className="w-[86.67%]" src={props.InnovationScores} alt="alt text" />
              <img className="w-[86.67%]" src={props.feasibilityScores} alt="alt text" />
              <img className="w-full" src={props.funScore} alt="alt text" />
            </div>

            <div className="flex flex-col w-[234px] h-[250px] absolute left-0 top-0">
              <img
                className="w-[472px] h-[558px] absolute left-[-161px] top-[-147px]"
                src={'/assets/1ac2516462b70f1d1f315e9f05ac7e8a.png'}
                alt="alt text"
              />
              <img
                className="w-[234px] h-[250px] absolute left-0 top-0"
                src={'/assets/1847d5a83e8744b3ec79df8125f3f4fd.png'}
                alt="alt text"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col bg-[image:var(--src)] bg-[center_center] bg-100% 100% bg-no-repeat w-[96.97%]"
        style={{ '--src': `url(${'/assets/e2f3f9d3cf24f1ce3ea043ab10fb6b6e.png'})` }}>
        <div className="w-[55px] flex flex-col mt-[15px] mr-[7.19%] mb-[38px] ml-auto">
          <img className="w-[55px] h-[53px]" src={'/assets/c061fddef295d9f8e2383d3eb465eb9a.png'} alt="alt text" />
          <img className="w-[55px] h-[49px]" src={'/assets/a78c26d62f7c37aff6719ad571ee3046.png'} alt="alt text" />
        </div>
      </div>
    </div>
  );
}

StuffDisplay.propTypes = {
  className: PropTypes.string,
  nerdMon: PropTypes.string.isRequired,
  dataSho: PropTypes.string.isRequired,
  funScores: PropTypes.string.isRequired,
  InnovationScores: PropTypes.string.isRequired,
  feasibilityScores: PropTypes.string.isRequired,
  funScore: PropTypes.string.isRequired
};

export default StuffDisplay;
