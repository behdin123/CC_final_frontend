import { ref } from 'vue';
import api from '../../../api/courseApi';

const lessons = ref([]);

async function fetchLessons(courseId) {

    try {
        lessons.value = await api.getLessonsByCourseId(courseId);

    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
}

const selectedLesson = ref('');


export { 
    lessons,
    selectedLesson,
    fetchLessons,
};
