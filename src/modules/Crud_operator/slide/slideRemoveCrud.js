import api from '../../../api/slideApi.js';
import { slides } from './slideGetCrud.js';

const removeSlide = async (id) => {
    console.log("ID in removeSlide: ", id);
    try {
        await api.deleteSlide(id);
        slides.value = slides.value.filter(slide => slide._id !== id);
    } catch (error) {
        console.error('Error removing slide:', error);
    }
};

export {
    removeSlide
};