import {
    SET_DISPLAY_IMAGE,
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE
} from '../constants/imageUploadConstants';


const initialState = {
    base64image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYoAAAEfCAIAAADQtxa3AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABl9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy40LjI8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTg6MDM6MjcgMDA6MDM6ODM8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+Mzk0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yODc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjA3NTg1MDVGMjA3NDExRTM5QTIwRjQ0MUFEM0NDRjVEPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjA3NTg1MDYwMjA3NDExRTM5QTIwRjQ0MUFEM0NDRjVEPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjA3NTg1MDVEMjA3NDExRTM5QTIwRjQ0MUFEM0NDRjVEPC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54bXAuZGlkOjA3NTg1MDVFMjA3NDExRTM5QTIwRjQ0MUFEM0NDRjVEPC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8ZGM6c3ViamVjdD4KICAgICAgICAgICAgPHJkZjpCYWcvPgogICAgICAgICA8L2RjOnN1YmplY3Q+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgry3nYvAAAQ6klEQVR4Ae3da3MUZRqAYcmBwCp8UEBlXRUlAXfL1f3/P0IOW4BapZYaBIkaTqshh9mmmhrS05NkpqcPT7997Yet6c5Mz9vX8/a9aEX31G+Pn711du30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',
    uploading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_DISPLAY_IMAGE: {
            const newImg = action.payload.base64image
            if (newImg != null) {
                return { ...state, base64image: newImg};
            }
            return initialState
        }
        case UPLOAD_IMAGE_REQUEST: {
            return {...state, uploading: true}
        }
        case UPLOAD_IMAGE_SUCCESS: {
            return initialState
        }
        case UPLOAD_IMAGE_FAILURE: {
            return initialState
        }
        default:
            return state;
    }
}