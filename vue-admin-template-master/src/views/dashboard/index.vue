<template >
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>
<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name:'Dashboard',
  components:{
    Card,
    Sale,
    Observe
    },
  mounted() {
    // this.$store.dispatch('home/getData')
    this.$store.dispatch('home/getData')
    // console.log(this.$store)
    // console.log(this.$store.state.home)
    // console.log(this.$store.state.home.list)
    
  },

}
</script>
<style scoped>
  
</style>