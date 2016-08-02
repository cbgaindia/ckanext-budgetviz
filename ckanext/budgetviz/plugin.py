import ckan.plugins as p
import ckan.plugins.toolkit as toolkit
import logging
import ckan.lib.datapreview as datapreview


log = logging.getLogger(__name__)

class Timeseries_IPFS(p.SingletonPlugin):

    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    # IConfigurer

    def update_config(self, config):
        p.toolkit.add_public_directory(config, 'theme/public')
        p.toolkit.add_template_directory(config ,'theme/templates')
        p.toolkit.add_resource('theme/public', 'ckanext-budgetviz')

    proxy_is_enabled = False

    def info(self):
        return {
                'name' : 'budgetviz',
                'title' : 'Timeseries - IPFS',
                'icon': 'bar-chart',
                'iframed': False
                }


    def configure(self, config):
        enabled = config.get('ckan.resource_proxy_enabled', False)
        self.proxy_is_enabled = enabled

    def can_view(self, data_dict):
        resource = data_dict['package']
        proxy_enabled = p.plugin_loaded('resource_proxy')
        same_domain = datapreview.on_same_domain(data_dict)
        return same_domain or proxy_enabled
      

    def view_template(self, context, data_dict):
        return 'timeseries_view.html'




    


  

    

