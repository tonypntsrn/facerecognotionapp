import React from 'react';

const Rank = ({name, entities}) => {
    return (
        <div>
            <div className='white f3'>
                {`${name} , your current entry count is...`}
            </div>
            <div className='white f1'>
                {entities}
            </div>
        </div>
    );
};

export default Rank;