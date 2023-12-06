import { ref } from 'vue';
import api from '../api/courseApi';

const draggingCard = ref(null);
const draggingColumn = ref(null);
const hoveredColumn = ref(null);

const dragStart = (cardId, columnId, event) => {
    event.target.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify({ cardId, columnId }));
    draggingCard.value = cardId;
    draggingColumn.value = columnId;
};

const dragEnd = (event) => {
    event.target.classList.remove("dragging");
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => column.classList.remove("dragover"));
    draggingCard.value = null;
    draggingColumn.value = null;
    hoveredColumn.value = null;
};

const dragEnter = (columnIndex, event) => {
    event.preventDefault();
    event.currentTarget.closest(".column").classList.add("dragover");
    draggingCard.value = null;
    draggingColumn.value = null;
    hoveredColumn.value = columnIndex;
};

const dragLeave = (event) => {
    event.preventDefault();
    if (event.relatedTarget !== null && event.currentTarget.contains(event.relatedTarget)) {
        return;
    }
    event.currentTarget.classList.remove("dragover");
    hoveredColumn.value = null;
};

const lessons = ref([]);

async function fetchLessons(courseId) {

    try {
        lessons.value = await api.getLessonsByCourseId(courseId);

    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
}

const selectedLesson = ref('');
  
  const drop = async (projectId, columnId, event) => {
    if (event) {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData("text/plain"));
        const { cardId, columnId: fromColumnId } = data;
        
        // Update the task's column on your backend
        await taskApi.updateTaskColumn(cardId, projectId, columnId);

        // Fetch the updated tasks for both columns
        await fetchTasksForColumns(projectId, [fromColumnId, columnId]);
    }
    hoveredColumn.value = null;
};




export { 
    draggingCard, 
    draggingColumn, 
    hoveredColumn,
    /* columns, */
    lessons,
    selectedLesson,
    dragStart, 
    dragEnd, 
    dragEnter, 
    dragLeave,
    /* fetchColumns,  */
    fetchLessons,
    drop,
};