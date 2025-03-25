
import joi from 'joi';
import joidate from '@joi/date';

const JoiExtended = joi.extend(joidate);

export {
    JoiExtended
}