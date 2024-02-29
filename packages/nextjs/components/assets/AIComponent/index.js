import React from 'react';
import PropTypes from 'prop-types';
import ChatSection from '~~/app/components/chat-section';
import cn from 'classnames';

function AIComponent(props) {
    return (
        <div className={`aicomponent flex flex-col items-center ${props.className || ''}`}>
            <div className="w-full flex justify-between gap-x-2.5">
                <img className="w-[175px] mb-[11px]" src={props.loader} alt="alt text" />
                <img
                    className="w-[35px] h-[58px] mt-[74px] mb-4"
                    src={'/assets/5ce85f987fead2f72fcca2633ad734a7.png'}
                    alt="alt text"
                />
                <img className="w-[260px] mt-[93px]" src={'/assets/b55eb40166c44402d83e63f60cb01a80.png'} alt="alt text" />
            </div>

            <ChatSection />
            <div className="w-[78.26%] flex justify-between gap-x-2.5 mt-6">
                <img
                    className="w-[140px] mt-[345px] mb-[23px]"
                    src={'/assets/8a4f067d584fd5ff0ccc923fde348dea.png'}
                    alt="alt text"
                />

                <div className="flex flex-col w-[70px] relative">
                    <img className="w-full relative" src={'/assets/754306395a4792ccc5e8900ea87dab3b.png'} alt="alt text" />
                    <img
                        className="w-[107px] h-[109px] absolute left-[-17px] top-[105px]"
                        src={'/assets/04834c7ffe21d535158e2eab0d0aaecc.png'}
                        alt="alt text"
                    />
                </div>
            </div>

            <div
                className="flex flex-col bg-[image:var(--src)] bg-[center_center] bg-100% 100% bg-no-repeat w-[93.79%] mt-[33px]"
                style={{ '--src': `url(${'/assets/27def4ad9bd74190330fbaa5eb082cce.png'})` }}>
                <img
                    className="w-[105px] h-[74px] mt-9 mr-[25px] mb-[29px] ml-auto"
                    src={'/assets/326d8452f0c354529c83120729c194c6.png'}
                    alt="alt text"
                />
            </div>
        </div>
    );
}

AIComponent.propTypes = {
    className: PropTypes.string,
    loader: PropTypes.string.isRequired
};

export default AIComponent;
