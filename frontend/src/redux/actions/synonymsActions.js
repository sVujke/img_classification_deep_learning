import { SYNONYMS_UPDATE } from '../constants/synonymsConstants'

export function synonymsUpdated(synonyms) {
    return {
        type: SYNONYMS_UPDATE,
        payload: {
            synonyms
        }
    }
}
