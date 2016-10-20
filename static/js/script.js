$(document).ready(function() {
    'use strict';

    var template, typeaheadOnClickCallback, typeaheadResultCallback,
        typeaheadReadyCallback, adaptLocation;

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

        adaptLocation(metadata.package);
        $('.js-typeahead').attr('value', metadata.package);

        modal = $('#addRepository');
        modal.find('.package').text(metadata.package);
        modal.find('a.package').attr('href', location.href);
        modal.find('#PackageName').attr('value', location.href);
        modal.find('.repository').text(metadata.repository);
        modal.find('.packagearch').text(metadata.arch);
        modal.modal();
    };

    typeaheadResultCallback = function(node, query, result) {
        if (query === '') { return; }

        if (result.length === 0) {
            $('.result-container').text('No results found :-(');
        } else {
            $('.result-container').text('');
        }
    };

    typeaheadReadyCallback = function(data) {
        var packageName, packageMetadata;

        if (location.hash !== '') {
            packageName = location.hash.slice(1);

            packageMetadata = data.filter(function(metadata) {
                return metadata.package == packageName;
            });

            if (packageMetadata.length > 0) {
                typeaheadOnClickCallback(null, null, packageMetadata[0]);
            }
        }

        // Visually feedback that TypeAhead is ready.
        $('.loading').removeClass('loading');
        $('.typeahead__search-icon').removeClass('fa')
                                    .removeClass('fa-spinner')
                                    .addClass('glyphicon')
                                    .addClass('glyphicon-search');
    };

    adaptLocation = function(packagename) {
        location.hash = '#' + packagename;
    };

    window.parsePackages = function(data) {
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
                onResult: typeaheadResultCallback,
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
        $('#RepositoryLabel').on('click', function() {
            var $copyInput;

            $copyInput = $('#PackageName');
            $copyInput.attr('type', 'text');
            $copyInput.select();
            document.execCommand('copy');
            $copyInput.attr('type', 'hidden');
        });
    }
});
