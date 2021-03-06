"use strict";

var semver = require("semver");

function isGitDependency(info) {
    return info.latest === "git";
}

function isAlreadyInstalled(info) {
    return info.updateTo === info.current;
}

function isUnstable(info) {
    // Check for hyphen in version string as this is a prerelease version according to SemVer
    return Boolean(info.updateTo && info.updateTo.indexOf("-") !== -1);
}

function isExcluded(info, exclude) {
    return exclude.map(function (name) {
        return name.trim();
    }).indexOf(info.name) !== -1;
}

function isCurrentGreaterThanUpdateTo(info) {
    return Boolean(info.current && info.updateTo !== "git" && semver.gt(info.current, info.updateTo));
}

function filter(config) {
    return function (info) {
        return isGitDependency(info) === false &&
            isAlreadyInstalled(info) === false &&
            isUnstable(info) === false &&
            isExcluded(info, config.exclude) === false &&
            isCurrentGreaterThanUpdateTo(info) === false;
    };
}

module.exports = filter;
