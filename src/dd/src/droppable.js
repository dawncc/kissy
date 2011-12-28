/**
 * @fileOverview droppable for kissy
 * @author yiminghe@gmail.com
 */
KISSY.add("dd/droppable", function (S, Node, Base, DDM) {

    /**
     * @memberOf DD
     * @class make a node droppable
     * @since version 1.2.0
     */
    function Droppable() {
        var self = this;
        Droppable.superclass.constructor.apply(self, arguments);
        self._init();
    }

    Droppable.ATTRS =
    /**
     * @lends DD.Droppable#
     */
    {
        /**
         * 放节点
         * @type {String|HTMLElement}
         */
        node:{
            setter:function (v) {
                if (v) {
                    return Node.one(v);
                }
            }
        },

        /**
         * groups this droppable object belongs to
         * @type {Object|boolean} true to match any group
         * @default true
         */
        groups:{
            value:true
        }

    };

    function validDrop(dropGroups, dragGroups) {
        if (dropGroups === true) {
            return 1;
        }
        for (var d in dropGroups) {
            if (dragGroups[d]) {
                return 1;
            }
        }
        return 0;
    }

    S.extend(Droppable, Base,
        /**
         * @lends DD.Droppable#
         */
        {
            /**
             * 用于被 droppable-delegate override
             * @protected
             */
            getNodeFromTarget:function (ev, dragNode, proxyNode) {
                var node = this.get("node"),
                    domNode = node[0];
                // 排除当前拖放和代理节点
                return domNode == dragNode ||
                    domNode == proxyNode
                    ? null : node;
            },

            _init:function () {
                DDM._regDrop(this);
            },

            _active:function () {
                var self = this,
                    drag = DDM.get("activeDrag"),
                    node = self.get("node"),
                    dropGroups = self.get("groups"),
                    dragGroups = drag.get("groups"),
                    prefixCls = DDM.get("prefixCls");
                if (validDrop(dropGroups, dragGroups)) {
                    DDM._addValidDrop(self);
                    // 委托时取不到节点
                    if (node) {
                        node.addClass(prefixCls + "drop-active-valid");
                    }
                } else if (node) {
                    node.addClass(prefixCls + "drop-active-invalid");
                }
            },

            _deActive:function () {
                var node = this.get("node"),
                    prefixCls = DDM.get("prefixCls");
                if (node) {
                    node.removeClass(prefixCls + "drop-active-valid")
                        .removeClass(prefixCls + "drop-active-invalid");
                }
            },

            __getCustomEvt:function (ev) {
                return S.mix({
                    drag:DDM.get("activeDrag"),
                    drop:this
                }, ev);
            },

            _handleOut:function () {
                var self = this,
                    ret = self.__getCustomEvt();
                self.get("node").removeClass(DDM.get("prefixCls") + "drop-over");
                /**
                 * html5 => dragleave
                 */
                self.fire("dropexit", ret);
                DDM.fire("dropexit", ret);
                DDM.fire("dragexit", ret);
            },

            _handleEnter:function (ev) {
                var self = this,
                    e = self.__getCustomEvt(ev);
                e.drag._handleEnter(e);
                self.get("node").addClass(DDM.get("prefixCls") + "drop-over");
                this.fire("dropenter", e);
                DDM.fire("dragenter", e);
                DDM.fire("dropenter", e);
            },


            _handleOver:function (ev) {
                var self = this,
                    e = self.__getCustomEvt(ev);
                e.drag._handleOver(e);
                self.fire("dropover", e);
                DDM.fire("dragover", e);
                DDM.fire("dropover", e);
            },

            _end:function () {
                var self = this,
                    ret = self.__getCustomEvt();
                self.get("node").removeClass(DDM.get("prefixCls") + "drop-over");
                self.fire('drophit', ret);
            },

            destroy:function () {
                DDM._unRegDrop(this);
            }
        });

    return Droppable;

}, { requires:["node", "base", "./ddm"] });