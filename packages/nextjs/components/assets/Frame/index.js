import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import renderSection1 from './section1.js';

function Frame(props) {
    return (
        <main className={`frame flex flex-col bg-white overflow-hidden ${props.className || ''}`}>
            {renderSection1(props)}
        </main>
    );
}

Frame.propTypes = {
    className: PropTypes.string
};

export default Frame;
