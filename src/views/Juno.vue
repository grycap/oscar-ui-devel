<template>
<v-layout row wrap>

  <v-layout align-center justify-center row wrap fill-height>
    <v-flex xs12>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-card flat>
                  <h2 style="padding: 16px;text-align: center;position:relative" >Juno</h2>
                <v-card-text  >
                  <v-layout class="rounded rounded-md" v-show="show_spinner" style="position:relative;align-content: center;">
                    <intersecting-circles-spinner style="left: 49.5%;"   :animation-duration="1200" :size="50" :color="'#0066ff'" />
                  </v-layout>
                  <v-layout v-if="!show_spinner" class="rounded rounded-md" >
                    <v-flex xs12 sm12  >
                      <v-flex  >   
                        <v-text-field
                          v-model="form.cpu"
                          :counter="10"
                          label="CPU"
                          style="padding-right: 5px;"
                        ></v-text-field>
                        <v-text-field 
                          v-model="form.memory"
                          :counter="10"
                          label="Memory RAM"
                          style="padding-right: 5px;"
                        ></v-text-field>
                        <v-select
                          v-model="bucket_selected"
                          style="padding-top: 25px;"
                          :items="bucket_list"
                          label="Buckets"
                          outline
                        ></v-select>
                        <v-text-field
                          v-model="form.vo"
                          label="VO"
                          style="padding-right: 5px;"
                        ></v-text-field>
                        <v-btn color="success" style="display: inline-flex; align-self: center;" @click="submit" >Create Juno
                        </v-btn>
                        <i v-if="waiting_cluster" style="display: inline-flex; margin-left: 10%;" class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
 
          </v-layout>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</v-layout>
</template>

<script>
import Services from '@/components/services';
import env from '../env';
import YAML from 'yaml'
import { IntersectingCirclesSpinner } from 'epic-spinners'
export default {
  mixins:[Services],
  components: {
    IntersectingCirclesSpinner,
	},
  props: {
    minio: {},
    openFaaS: {}
  },
  data: () => ({
    user: (localStorage.getItem("user")?localStorage.getItem("user"): JSON.parse(localStorage.getItem("session")).user.info.name  ),
    show_spinner: true,
    waiting_cluster: false,
    accessKey:localStorage.getItem("accessKey"),
    api:localStorage.getItem("api"),
    endpoint:localStorage.getItem("endpoint"),
    bucket_list: [],
    bucket_selected:"",
    services:[],
    menus:[],
    valid: true,
    form: {},
    rules: {
      required: value => !!value || 'Required.',
      endpoint: [
        v => !!v || 'Endpoint is required'
      ]
    },
    showMinioSecretKey: false,
    minioConfig: {},
    openFaaSConfig: {}
  }),
  created: function () {
    this.getJuno()
  },
  methods: {
    async getJuno(){
      this.getBucketListCall(this.getBucketCallBack)
      const url=env.juno.repo+env.juno.service
      await $.ajax({
          url: url,
          type: 'GET',
          context: this,
          success: function (response) {
            const parse=YAML.parse(response)
            this.form=Object.assign({}, parse.functions.oscar[0]["oscar-cluster"]);
          }
      });
      const script=env.juno.repo+env.juno.script
      await $.ajax({
          url: script,
          type: 'GET',
          context: this,
          success: function (response) {
            this.form.script=response
          }
      });
      const token=Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2)  
      let user=""
      let bucket=""
      if (this.isMultiTenant()){
        user="juno"+this.accessKey.slice(0, 6)
        bucket="home"+this.accessKey.slice(0, 6)
        this.form.allowed_users =[this.accessKey]
      }else{
        user="junooscar"
        bucket="home"
      }
      this.form.name=user
      this.form.environment.Variables["OSCAR_ENDPOINT"]=this.api
      this.form.environment.Variables["JUPYTER_TOKEN"]= token
      this.form.environment.Variables["JHUB_BASE_URL"]= "/system/services/"+user+"/exposed" 
      this.bucket_list.push(bucket)
      this.bucket_selected=bucket
      this.show_spinner=false
    },
    getBucketCallBack(response){
      try{
				if(response?.code !== 'AccessDenied'){
					response.forEach(element => {
            this.bucket_list.push(element.name)  
          });
          console.log(response)
			  }
      }catch(err) {
            console.error("ERROR with list buckets "+err);
      }
		},

    isMultiTenant(){
      if(this.accessKey != 'minio')return true
      else return false
    },
		createServiceCallBack(response){
			if(response.status == 201){
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} was successfully created.`, color: 'success', timeout: 12000 })
				window.getApp.$emit('REFRESH_BUCKETS_LIST')
        this.waiting_cluster=false
      }else if(response == "Error: Request failed with status code 409"){
        this.editServiceCall(this.form, this.editServiceCallBack)
			}else {
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
        this.waiting_cluster=false
			}

		},
    submit(){
      this.waiting_cluster=true
      this.form.environment.Variables["JUPYTER_DIRECTORY"]= "/mnt/"+this.bucket_selected
      this.form.mount.path=this.bucket_selected
      this.createServiceCall(this.form,this.createServiceCallBack)
    },
    editServiceCallBack(response){
			if(response.status == 204){
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} has been updated`, color: 'success' })
			}else {
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
			}
      this.waiting_cluster=false
		},
  }
}
</script>
<style scoped lang="css">
  .password {
    display: inline;
  }
  .textinfo{
    margin-bottom: 0px;
    padding-top: 5px;
  }
  .iconclass{
    margin-right: 0px;
    padding: 5px;
    color: #0056b3;
  }
  .iconposition{
    position:relative;
    top: -7px;
  }
  .styleflex{
    display: flex;
  }
  .panel_info{
    margin-top: 0%;
  }

</style>