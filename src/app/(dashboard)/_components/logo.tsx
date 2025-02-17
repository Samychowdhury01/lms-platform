import Image from 'next/image';
import React from 'react';

const Logo:React.FC = () => {
    return (
        <Image
        height={130}
        width={130}
        alt='company-logo'
        src='/logo.svg'
        >
            
        </Image>
    );
};

export default Logo;