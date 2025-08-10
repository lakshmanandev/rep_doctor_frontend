import React from 'react';
import { Loader } from 'react-feather';

const PageLoader = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Loader className='text-center w-100' />
    </div>
);


export default PageLoader;
