export default {
  name: "Notfound",
  data() {
    return {
      timer:null,
      date:30
    }
  },
  mounted() {
    this.date = 30
    this.timer = setInterval(() => {
      this.date--
      if(this.date === 0){
        this.date = 0
        this.$router.push('/index')
      }
      console.log('aa');
    },1000)

  },
  methods: {
    toIndex(){
      this.$router.push('/index')
    }
  },
  destroyed () {
    if(this.timer){
      clearInterval(this.timer)
      this.date = 30
    }
  }
}
