import Head from '../../components/head/Head.vue'
export default {
  name: "ProjectIndex",
  data() {
    return {
      projectList: [],
      defaultOpeneds: []
    }
  },
  mounted(){
    this.defaultOpeneds = [this.$route.params.id];
    this.$http.post('/Manage/User/index', {
      'User_Id':window.localStorage.getItem('userId')
    }).then((data) => {
      console.log(data);
      this.projectList = data.Data.data.projectList ? data.Data.data.projectList : []
      this.$store.commit('changeHeadData', this.projectList);
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    }
  },
  components:{
    'v-head':Head
  }

}
