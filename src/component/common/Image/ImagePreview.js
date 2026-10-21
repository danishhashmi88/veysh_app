import React, { useState } from 'react';
import {
    View,
    Image,
} from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { getImageUrl } from '../../../utils/helper';

const ImagePreview = ({ image, resizeMode, style }) => {
    const [hasError, setHasError] = useState(false);

    const uri = getImageUrl(image);
    const validUri = typeof uri === 'string' ? uri : null;

    const imageSource =
        !hasError && validUri
            ? { uri: validUri }
            : imagePath?.avtara;


    return (
        <View>
            <Image
                source={imageSource}
                style={style}
                resizeMode={resizeMode}
                onError={() => setHasError(true)} // 🔥 key part
            />
        </View>
    );
};

export default ImagePreview;
