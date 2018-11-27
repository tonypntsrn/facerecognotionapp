import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box}) => {
    const {leftCol, topRow, rightCol, bottomRow} = box;
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='input-image' src={imageUrl} alt="" width='500' height='auto'/>
                <div className='bounding-box' style={{
                    top: topRow,
                    right: rightCol,
                    bottom: bottomRow,
                    left: leftCol
                }}></div>
            </div>
        </div>
    );
};

export default FaceRecognition;