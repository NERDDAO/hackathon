import React from 'react';
import cn from 'classnames';
import AIComponent from '../AIComponent';
import InputFields from '../InputFields';
import NavBar from '../NavBar';
import PageBar from '../PageBar';
import StuffDisplay from '../StuffDisplay';

function renderSection1(props) {
    return (
        <section className="flex flex-col">
            <div
                className="flex flex-col bg-[image:var(--src)] bg-[center_center] bg-100% 100% bg-no-repeat w-[95.6%] mt-12 mx-auto mb-[31px]"
                style={{ '--src': `url(${'/assets/background.png'})` }}>
                <div className="w-[89.77%] flex justify-between gap-x-2.5 mt-[31px] mx-auto mb-[45px]">
                    <div className="w-[699px] flex flex-col items-center gap-y-[37px] mx-auto mb-4">
                        <div className="flex flex-col w-[97.85%] relative">
                            <img
                                className="w-[107px] h-[101px] absolute right-5 bottom-[-39px]"
                                src={'/assets/d24248022bcbffa2d1fcb3cb88eb6f87.png'}
                                alt="alt text"
                            />
                            <NavBar
                                className="relative"
                                button1={'/assets/3c066f72b80810810480a0ae57f49617.png'}
                                button2={'/assets/98566ac80d9ee939497217bee94306fd.png'}
                                button3={'/assets/fa77ee24c3ce0d01ed6b79c84fd78be7.png'}
                                statusLight={'/assets/750265fcbffacdae2efec8c5eecce7f5.png'}
                            />
                        </div>

                        <div className="w-full flex flex-col items-center">
                            <StuffDisplay
                                className="w-[94.42%]"
                                InnovationScores={'/assets/62d3ac3549bca90974e1ef765aaa28f0.png'}
                                content={'/assets/e2f3f9d3cf24f1ce3ea043ab10fb6b6e.png'}
                                dataSho={'/assets/7d1c1aa2479e0153355ed834a6f47aac.png'}
                                feasibilityScores={'/assets/50148a3c692c225436eeaa47f6cf8565.png'}
                                funScore={'/assets/a0700d250dbd7406a3b78801b1724476.png'}
                                funScores={'/assets/fa7294d3f20563699a55cabeb62bf86d.png'}
                                nerdMon={'/assets/75d18e2d44f4660ac5a59207caabf0bb.png'}
                            />
                            <PageBar className="w-[76.39%] mt-1.5" />
                            <InputFields className="w-full" content_box3={'/assets/b6c5926e1621c2c8d2af665a37e9ffaa.png'} />
                        </div>
                    </div>

                    <AIComponent className="w-[644px] mt-[88px]" loader={'/assets/5089bf6e0f177cb3136fbb4a20b826f6.png'} />
                </div>
            </div>
        </section>
    );
}

export default renderSection1;
