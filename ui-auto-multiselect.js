/*
 * jQuery UI Autocomplete Multiselect Widget
 *
 * developed by FZambia, 2011
 *
 * thanks jQuery UI developers for their great widget library:
 * http://docs.jquery.com/
 *
 * Depends:
 *      jquery.ui.autocomplete.js
 */
(function($) {
	automultiselect = {
	    options:{
	        source:'/',
	        prefix:'user',
	        value:'',
	        delay:300,
	        minLength:2,
	        help:'начните ввод...',
	        help_before:true,
	        initial:{},
	        style:'default'
	    },
	    _create:function(){
	        this._render();
	    },
	    _render:function(){
	        var e = this.element;
	        var o = this.options;
	        this._create_html();
	        var self = this;
	        e.autocomplete({
	            source: o.source,
	            minLength: o.minLength,
	            delay:o.delay,
	            select: function(event, ui) {
	                this.value='';
	                var element = self._make_tag(ui.item.value,ui.item.id);
	                self._change_list(ui.item.id,'add',element);
	                return false;
	            }
	        }).keypress(function(e) {
	            if (e.keyCode === 13) {
	                return false;
	            }
	        })
	    },
	    _create_html:function() {
	        this.hidden = $('<input type="hidden" name="'+this.options.prefix+'_list" value="'+this.options.value+'" />');
	        this.wrapper = $('<div class="mt-select-block" id="'+this.options.prefix+'-mt-select-block"></div>');
	        this.mt_container = $('<div class="mt-container"></div>')
	        this.help = $('<i class="mt-help-text"> '+this.options.help+'</i>');
	        this.element.wrap(this.mt_container);
	        this.element.wrap(this.wrapper);
	        if (this.options.help_before) {
	            this.element.before(this.help);
	        } else {
	        	this.element.after(this.help);
	        }
	        this.element.after(this.hidden);
	        this.tag_wrapper = $('<div class="mt-tag-block" id="'+this.options.prefix+'-mt-tag-block"></div>');
	        this.list_wrapper = $('<div class="mt-representation"></div>');
	        this.list = $('<ul class="mt-items" id="'+this.options.prefix+'-mt-items"></ul>');
	        for (key in this.options.initial) {
	        	var id = key;
	        	var value = this.options.initial[key];
	        	var tag = this._make_tag(value,id);
	        	this._change_list(id,'add',tag);
	        }
	        this.tag_wrapper.append(this.list_wrapper);
	        this.list_wrapper.append(this.list);
	        this.element.parent().after(this.tag_wrapper);
	    },
	    _make_tag:function(value,id) {
	    	var self = this;
	    	var style = this.options.style;
			if (style==='jira') {
				var item ='<li style="display:none;" title="'+value+'" mt_id="'+id+'" class="mt-item-row">';
					item+='<button class="mt-value-item" tabindex="-1" type="button">';
					item+='<span><span class="mt-value-text">'+value+'</span></span>';
					item+='</button>';
					item+='<em title="remove" class="mt-item-delete"></em>';
					item+='</li>';
			} else if (style==='default') {
				var item ='<li style="display:none;" title="'+value+'" mt_id="'+id+'" class="fg-button ui-state-default fg-button-icon-right ui-corner-all">';
					item+='<em title="remove" class="ui-icon ui-icon-circle-close"></em>'+value;
					item+='</li>';	
			} else if (style==='stackoverflow') {
				var item = '<li title="'+value+'" mt_id="'+id+'" class="post-tag" href="#">'+value+'<em title="remove" class="delete-tag"></em></li>';
			}
			var tag = $(item);
			tag.find('em').bind('click',function(){
				self._change_list(tag.attr('mt_id'),'remove',tag);
			})
			if (style==='default') {
			    tag.find('em').hover(function(){
			    	$(this).parent().addClass('ui-state-active');
			    },function(){
			    	$(this).parent().removeClass('ui-state-active');
			    })
			}
			return tag;
	    },
	    _change_list:function(id,action,element) {
			var val = this.hidden.val();
			var ids = val.split(',');
			if (action=='add') {
			    if (jQuery.inArray(id.toString(),ids)>0) {return false;}
			    this.list.append(element);
			    element.fadeIn();
			    ids.push(id);
			    this.hidden.val(ids.toString());
			    return true;
			} else if (action=='remove') {
			    var pos = jQuery.inArray(id.toString(),ids);
			    ids.splice(pos,1);
			    element.fadeOut('slow', function() { $(this).remove(); })
			    this.hidden.val(ids.toString());
			    return true;
			}
	    }
	}
	
	$.widget("ui.automultiselect",automultiselect);
	
}(jQuery));
