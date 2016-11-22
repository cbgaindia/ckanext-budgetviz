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
        p.toolkit.add_public_directory(config, 'timeseries_ipfs/theme/public')
        p.toolkit.add_template_directory(config ,'timeseries_ipfs/theme/templates')
        p.toolkit.add_resource('public', 'base_css')
        p.toolkit.add_resource('timeseries_ipfs/theme/public', 'timeseriesipfs')
    proxy_is_enabled = False

    def info(self):
        return {
                'name' : 'timeseries_ipfs',
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
        return 'timeseries_ipfs_view.html'

    def setup_template_variables(self, context, data_dict):
        resource = data_dict['resource']
        resource_view = data_dict['resource_view']

        return {'resource': resource,
                'resource_view': resource_view,
               }

class GroupBarChart_Munc(p.SingletonPlugin):

    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    # IConfigurer
    def update_config(self, config):
        p.toolkit.add_public_directory(config, 'groupbarchart_munc/theme/public')
        p.toolkit.add_template_directory(config ,'groupbarchart_munc/theme/templates')
        
        p.toolkit.add_resource('groupbarchart_munc/theme/public', 'groupbarchart_munc')
        p.toolkit.add_resource('public', 'base_css')
    proxy_is_enabled = False

    def info(self):
        return {
                'name' : 'groupbarchart_munc',
                'title' : 'Group Bar Chart - Municipal Corporations',
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
        return 'groupbarchart_view.html'

    def setup_template_variables(self, context, data_dict):
        resource = data_dict['resource']
        resource_view = data_dict['resource_view']

        return {'resource': resource,
                'resource_view': resource_view,
               }

class Timeseries_RBI(p.SingletonPlugin):

    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    # IConfigurer
    def update_config(self, config):
        p.toolkit.add_public_directory(config, 'timeseries_rbi/theme/public')
        p.toolkit.add_template_directory(config ,'timeseries_rbi/theme/templates')
        p.toolkit.add_resource('timeseries_rbi/theme/public', 'timeseriesrbi')
        p.toolkit.add_resource('public', 'base_css')
        
    proxy_is_enabled = False

    def info(self):
        return {
                'name' : 'timeseries_rbi',
                'title' : 'Timeseries - RBI',
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
        return 'timeseries_rbi_view.html'

    def setup_template_variables(self, context, data_dict):
        resource = data_dict['resource']
        resource_view = data_dict['resource_view']

        return {'resource': resource,
                'resource_view': resource_view,
               }

class Timeseries_Union(p.SingletonPlugin):

    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    # IConfigurer
    def update_config(self, config):
        p.toolkit.add_public_directory(config, 'timeseries_union/theme/public')
        p.toolkit.add_template_directory(config ,'timeseries_union/theme/templates')
        p.toolkit.add_resource('public', 'base_css')
        p.toolkit.add_resource('timeseries_union/theme/public', 'timeseries_union')

    proxy_is_enabled = False

    def info(self):
        return {
                'name' : 'timeseries_union',
                'title' : 'Timeseries - Union Budget',
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
        return 'timeseries_union_view.html'

    def setup_template_variables(self, context, data_dict):
        resource = data_dict['resource']
        resource_view = data_dict['resource_view']

        return {'resource': resource,
                'resource_view': resource_view,
               }



  

    

