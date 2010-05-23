/*
 * jQuery doubleSelect Plugin
 * version: 1.3
 * @requires jQuery v1.3.2 or later
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @version $Id: jquery.doubleSelect.js 3 2009-04-24 12:00:00Z $
 * @author  Johannes Geppert <post at jgeppert dot com> http://www.jgeppert.com
 *  7/23/2009 - J. Hinds change to two pass method to locate element for 'selected' attribute
 */

/**
 * Converts passed JSON options into <select> elements.
 * 
 * @param String
 *            id of the second select box
 * @param String
 *            option values
 * @param array
 *            options additional options (optional)
 */

 (function($) {
    $.fn.doubleSelect = function(doubleid, values, options) {

        options = $.extend({
            preselectFirst: null,
            preselectSecond: null,
            emptyOption: false,
            emptyKey: -1,
            emptyValue: 'Choose ...'
        },
        options || {});

        var $first = this;
        var $secondid = "#" + doubleid;
        var $second = $($secondid);

        var setValue = function(value) {
            $second.val(value).change();
        };

        var removeValues = function() {
            $($secondid + " option").remove();
        };

        $(this).change(function() {
            removeValues();
            $current = this.options[this.selectedIndex].value;
            if ($current != '') {
                $.each(values,
                function(k, v) {
                    var bestk;
                    if ($current == v.key) {
                        $.each(v.values,
                        function(k, v2) {
                            if (!bestk && (v.defaultvalue !== null && v2 == v.defaultvalue)) {
                                bestk = k;
                            }
                            if (options.preselectSecond !== null && v2 == options.preselectSecond) {
                                bestk = k;
                            }
                        });
                        $.each(v.values,
                        function(k, v2) {
                          var o = $("<option>").html(k).attr('value', v2);
                          if (options.preselectSecond) {
                            $.each(options.preselectSecond,
                              function(index, selected) {
                                if (v2 == selected) o.html(k).attr("selected", "selected");
                              }
                            );
                          }
                          o.appendTo($second);
                        });
                    }
                });

            } else {
                setValue(options.emptyValue);
            }
        });

        return this.each(function() {
            $first.children().remove();
            $second.children().remove();

            if (options.emptyOption) {
                var oe = $("<option>").html(options.emptyValue).attr('value', options.emptyKey);
                oe.appendTo($first);
            }

            $.each(values,
            function(k, v) {
                var of = $("<option>").html(k).attr('value', v.key);
                if (options.preselectFirst !== null && v.key == options.preselectFirst) {
                    of.html(k).attr("selected", "selected");
                }
                of.appendTo($first);

            });

            if (options.preselectFirst === null) {
                $current = this.options[this.selectedIndex].value;
                if ($current != '') {
                    $.each(values,
                    function(k, v) {
                        var bestk;
                        if ($current == v.key) {
                            $.each(v.values,
                            function(k, v2) {
                                if (!bestk && (v.defaultvalue !== null && v2 == v.defaultvalue)) {
                                    bestk = k;
                                }
                                if (options.preselectSecond !== null && v2 == options.preselectSecond) {
                                    bestk = k;
                                }
                            });
                            $.each(v.values,
                            function(k, v2) {
                                var o = $("<option>").html(k).attr('value', v2);
                                if (k === bestk) { o.html(k).attr("selected", "selected"); }
                                o.appendTo($second);
                            });

                        }

                    });

                } else {
                    setValue(options.emptyValue);
                }
            } else {
                $first.change();
            }

        });

    };
})(jQuery);
