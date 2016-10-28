$(document).ready(function() {
    'use strict';

    var availableRepos, template, typeaheadOnClickCallback,
        typeaheadResultCallback, typeaheadReadyCallback, adaptLocation;

    availableRepos = [
        'community',
        'devel',
        'elementary',
        'gaming-live',
        'haskell',
        'kdepim',
        'mudler',
        'pentesting',
        'science',
        'sihnon-common',
        'sihnon-desktop',
        'sihnon-server',
        'unity'
    ];

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

    $('#custom-search-input').after([
        '<ul class="repositories">',
        availableRepos.map(function(repo) {
            return '<li><button type="button">' + repo + '</button></li>';
        }).join(''),
        '</ul>',
        '<div class="repository-feed">',
        '</div>'
    ].join(''));

    if (!('rss' in $.fn)) {
        $(document.body).append('<script type="text/javascript" src="/community-website/js/jquery.rss.min.js"></script>');
    }

    $('.repositories').on('click', function(event) {
        var repositoryName, feedUrl;

        repositoryName = $(event.target).find('button').text();
        feedUrl = 'http://mirror.it.sabayon.org/community/community/standard/community/database/amd64/5/updates.rss';

        $('.repository-feed').rss(feedUrl, {
            ssl: true,
            entryTemplate: '<li><a href="{url}">{title}</a><br />{shortBodyPlain}</li>',
            layoutTemplate: '<ul style="list-style:none;padding:0;">{entries}</ul>'
        });
    });
});
