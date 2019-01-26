let cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  name: "RoleManagement",
  data () {
    return{
      dialogFormVisible:false,
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,

    }
  },
  methods:{
    createRole() {

    },

    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
  },
  mounted () {
    //面包屑
    const headerObj = this.$store.state.header.headData.find(item => item.Project_Code === this.$route.params.id);
    console.log(headerObj, 'headerObj');
    this.$store.commit('changeHeadTitle', [
      {
        url: '',
        title: '系统管理'
      },
      {
        url:'',
        title:'角色管理'
      }
    ])
  }
}
