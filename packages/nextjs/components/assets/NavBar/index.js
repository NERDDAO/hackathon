import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Image from 'next/image';

function NavBar(props) {
    return (
        <div className={`nav-bar flex justify-between gap-x-2.5 ${props.className || ''}`}>
            <div className="w-[314px] flex mt-[17px]">
                <img className="w-[115px] mt-[5px]" src={'/assets/62870356b7079435ea886e0b072d06bd.png'} alt="alt text" />

                <div className="w-[199px] flex flex-col mb-[25px]">
                    <img className="w-full" src={'/assets/449230ecfe61a5096be41b7557dffd50.png'} alt="alt text" />
                    <img className="w-[70px] h-[39px] ml-[30.15%]" src={props.statusLight} alt="alt text" />
                </div>
            </div>
            <button style={{
            }} className={"bg-[url(/assets/3c066f72b80810810480a0ae57f49617.png)] bg-no-repeat cursor-pointer w-[110px] h-[73px] mt-[40px] bottom-20"} onClick={() => setActiveTab('submit')}><span className={"mb-10"}>Submit</span>


            </button>
            <button className={"bg-[url(/assets/3c066f72b80810810480a0ae57f49617.png)] bg-no-repeat w-[100px] h-[90px] mb-20 mt-[40px]"} onClick={() => setActiveTab('update')}>Update

            </button>
            <button className={"bg-[url(/assets/3c066f72b80810810480a0ae57f49617.png)] bg-no-repeat w-[105px] h-[90px] mt-[40px] mb-20"} onClick={() => setActiveTab('browse')}>Browse


            </button>
        </div>
    );
}

NavBar.propTypes = {
    className: PropTypes.string,
    statusLight: PropTypes.string.isRequired,
    button1: PropTypes.string.isRequired,
    button2: PropTypes.string.isRequired,
    button3: PropTypes.string.isRequired
};

export default NavBar;
