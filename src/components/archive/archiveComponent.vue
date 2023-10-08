 <!-- Catalogs printet out -->
 <div class="project-container">
    <!-- :style="{ backgroundImage: projectBackgroundImage(project) }" -->
    <div class="project" v-for="catalog in catalogs" :key="catalog._id">

      <div class="project-content">
        <div>
          <h3>{{ catalog.name }}</h3>
          <p>{{ catalog.description }}</p>
        </div>

        <div class="project-btn-div">
          <button class="button project-btn-margin edit-button" @click="openProjectUpdatePopup(project)" >
            Edit
            <span class="edit-icon"></span>
          </button>
          <button class="button project-btn-margin" @click.stop="openProject(project)">Open Project</button>
        </div>

      </div>

    </div>
  </div>
