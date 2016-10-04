$(document).ready(function() {
    var template, typeaheadOnClickCallback, typeaheadReadyCallback, adaptLocation;

    template = [
        '<span>{{package}} ',
        '<span class="arch">~{{arch}}</span>',
        '</span> ',
        '<span style="color:green;" class="kk-suggest-detail"> ',
        '{{repository}}',
        '</span>'
    ].join('');

    typeaheadOnClickCallback = function($searchInput, $resultItem, metadata) {
        var modal;

        modal = $('#addRepository');
        modal.find('span.package').text(metadata.package);
        modal.find('#PackageName').attr('value', metadata.package);
        modal.find('.repository').text(metadata.repository);
        modal.find('.packagearch').text(metadata.arch);
        modal.modal();

        adaptLocation(metadata.package);
    };

    typeaheadReadyCallback = function(data) {
        var packageName, packageMetadata;

        if (location.hash != '') {
            packageName = location.hash.slice(1);

            packageMetadata = data.filter(function(metadata) {
                return metadata.package == packageName;
            });

            if (packageMetadata.length > 0) {
                typeaheadOnClickCallback(null, null, packageMetadata[0]);
            }
        }
    };

    adaptLocation = function(packagename) {
        location.hash = '#' + packagename;
    };

    parsePackages = function(data) {
        $('#searchpkg .js-typeahead').typeahead({
            order: "asc",
            dynamic: !0,
            delay: 500,
            source: {
                packages: {
                    display: "package",
                    data: data,
                    template: template
                }
            },
            callback: {
                onClick: typeaheadOnClickCallback,
                onReady: function(node) {
                    typeaheadReadyCallback(data);
                }
            }
        });

    };

    // JSONP calls parsePackages with payload after finish
    $.ajax({
        url: "https://scrmirror.sabayonlinux.org/mirrors/sabayonlinux/community/metadata.json",
        dataType: "jsonp",
    });

    if ('execCommand' in document) {
        $('#PackageName').on('focus', function() {
            $(this).select();
            document.execCommand('copy');
        });
    }
});
