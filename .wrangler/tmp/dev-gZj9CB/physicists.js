var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    form[key] = value;
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", 8);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p.at(-1) === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? decodeURIComponent_(value) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = /* @__PURE__ */ __name(class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : void 0;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.#cachedBody("json");
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
}, "HonoRequest");

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = /* @__PURE__ */ __name((headers, map = {}) => {
  for (const key of Object.keys(map)) {
    headers.set(key, map[key]);
  }
  return headers;
}, "setHeaders");
var Context = /* @__PURE__ */ __name(class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status = 200;
  #executionCtx;
  #headers;
  #preparedHeaders;
  #res;
  #isFresh = true;
  #layout;
  #renderer;
  #notFoundHandler;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    this.#isFresh = false;
    return this.#res ||= new Response("404 Not Found", { status: 404 });
  }
  set res(_res) {
    this.#isFresh = false;
    if (this.#res && _res) {
      try {
        for (const [k, v] of this.#res.headers.entries()) {
          if (k === "content-type") {
            continue;
          }
          if (k === "set-cookie") {
            const cookies = this.#res.headers.getSetCookie();
            _res.headers.delete("set-cookie");
            for (const cookie of cookies) {
              _res.headers.append("set-cookie", cookie);
            }
          } else {
            _res.headers.set(k, v);
          }
        }
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("immutable")) {
          this.res = new Response(_res.body, {
            headers: _res.headers,
            status: _res.status
          });
          return;
        } else {
          throw e;
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (value === void 0) {
      if (this.#headers) {
        this.#headers.delete(name);
      } else if (this.#preparedHeaders) {
        delete this.#preparedHeaders[name.toLocaleLowerCase()];
      }
      if (this.finalized) {
        this.res.headers.delete(name);
      }
      return;
    }
    if (options?.append) {
      if (!this.#headers) {
        this.#isFresh = false;
        this.#headers = new Headers(this.#preparedHeaders);
        this.#preparedHeaders = {};
      }
      this.#headers.append(name, value);
    } else {
      if (this.#headers) {
        this.#headers.set(name, value);
      } else {
        this.#preparedHeaders ??= {};
        this.#preparedHeaders[name.toLowerCase()] = value;
      }
    }
    if (this.finalized) {
      if (options?.append) {
        this.res.headers.append(name, value);
      } else {
        this.res.headers.set(name, value);
      }
    }
  };
  status = (status) => {
    this.#isFresh = false;
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    if (this.#isFresh && !headers && !arg && this.#status === 200) {
      return new Response(data, {
        headers: this.#preparedHeaders
      });
    }
    if (arg && typeof arg !== "number") {
      const header = new Headers(arg.headers);
      if (this.#headers) {
        this.#headers.forEach((v, k) => {
          if (k === "set-cookie") {
            header.append(k, v);
          } else {
            header.set(k, v);
          }
        });
      }
      const headers2 = setHeaders(header, this.#preparedHeaders);
      return new Response(data, {
        headers: headers2,
        status: arg.status ?? this.#status
      });
    }
    const status = typeof arg === "number" ? arg : this.#status;
    this.#preparedHeaders ??= {};
    this.#headers ??= new Headers();
    setHeaders(this.#headers, this.#preparedHeaders);
    if (this.#res) {
      this.#res.headers.forEach((v, k) => {
        if (k === "set-cookie") {
          this.#headers?.append(k, v);
        } else {
          this.#headers?.set(k, v);
        }
      });
      setHeaders(this.#headers, this.#preparedHeaders);
    }
    headers ??= {};
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        this.#headers.set(k, v);
      } else {
        this.#headers.delete(k);
        for (const v2 of v) {
          this.#headers.append(k, v2);
        }
      }
    }
    return new Response(data, {
      status,
      headers: this.#headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => {
    return typeof arg === "number" ? this.#newResponse(data, arg, headers) : this.#newResponse(data, arg);
  };
  text = (text, arg, headers) => {
    if (!this.#preparedHeaders) {
      if (this.#isFresh && !headers && !arg) {
        return new Response(text);
      }
      this.#preparedHeaders = {};
    }
    this.#preparedHeaders["content-type"] = TEXT_PLAIN;
    if (typeof arg === "number") {
      return this.#newResponse(text, arg, headers);
    }
    return this.#newResponse(text, arg);
  };
  json = (object, arg, headers) => {
    const body = JSON.stringify(object);
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "application/json";
    return typeof arg === "number" ? this.#newResponse(body, arg, headers) : this.#newResponse(body, arg);
  };
  html = (html, arg, headers) => {
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "text/html; charset=UTF-8";
    if (typeof html === "object") {
      return resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then((html2) => {
        return typeof arg === "number" ? this.#newResponse(html2, arg, headers) : this.#newResponse(html2, arg);
      });
    }
    return typeof arg === "number" ? this.#newResponse(html, arg, headers) : this.#newResponse(html, arg);
  };
  redirect = (location, status) => {
    this.#headers ??= new Headers();
    this.#headers.set("Location", String(location));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
}, "Context");

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    const isContext = context instanceof Context;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (isContext) {
          context.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (!handler) {
        if (isContext && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && isContext && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = /* @__PURE__ */ __name(class extends Error {
}, "UnsupportedPathError");

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = /* @__PURE__ */ __name(class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        replaceRequest = options.replaceRequest;
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
}, "Hono");

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = /* @__PURE__ */ __name(class {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, "Node");

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = /* @__PURE__ */ __name(class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, "Trie");

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = /* @__PURE__ */ __name(class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
}, "RegExpRouter");

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = /* @__PURE__ */ __name(class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
}, "SmartRouter");

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = /* @__PURE__ */ __name(class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.#children).includes(p)) {
        curNode = curNode.#children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.#children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[p];
    }
    const m = /* @__PURE__ */ Object.create(null);
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      score: this.#order
    };
    m[method] = handlerSet;
    curNode.#methods.push(m);
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
            continue;
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
}, "Node");

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = /* @__PURE__ */ __name(class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
}, "TrieRouter");

// node_modules/hono/dist/hono.js
var Hono2 = /* @__PURE__ */ __name(class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
}, "Hono");

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class extends Error {
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  get errors() {
    return this.issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
__name(ZodError, "ZodError");
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, "errorMap");
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");
var makeIssue = /* @__PURE__ */ __name((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
var ParseStatus = class {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
__name(ParseStatus, "ParseStatus");
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name((x) => x.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name((x) => x.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name((x) => x.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
__name(__classPrivateFieldGet, "__classPrivateFieldGet");
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
__name(__classPrivateFieldSet, "__classPrivateFieldSet");
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
__name(ParseInputLazyPath, "ParseInputLazyPath");
var handleResult = /* @__PURE__ */ __name((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
var ZodType = class {
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name((val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name(() => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      }), "setError");
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this, this._def);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
__name(ZodType, "ZodType");
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
__name(timeRegexSource, "timeRegexSource");
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, "timeRegex");
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, "datetimeRegex");
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
var ZodString = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
__name(ZodString, "ZodString");
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
__name(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
__name(ZodNumber, "ZodNumber");
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = BigInt(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
__name(ZodBigInt, "ZodBigInt");
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodBoolean, "ZodBoolean");
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
__name(ZodDate, "ZodDate");
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodSymbol, "ZodSymbol");
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodUndefined, "ZodUndefined");
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodNull, "ZodNull");
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
__name(ZodAny, "ZodAny");
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
__name(ZodUnknown, "ZodUnknown");
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
__name(ZodNever, "ZodNever");
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name(ZodVoid, "ZodVoid");
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
__name(ZodArray, "ZodArray");
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
var ZodObject = class extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
__name(ZodObject, "ZodObject");
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
__name(ZodUnion, "ZodUnion");
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = /* @__PURE__ */ __name((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
__name(ZodDiscriminatedUnion, "ZodDiscriminatedUnion");
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
__name(ZodIntersection, "ZodIntersection");
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
};
__name(ZodTuple, "ZodTuple");
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
__name(ZodRecord, "ZodRecord");
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
__name(ZodMap, "ZodMap");
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
__name(ZodSet, "ZodSet");
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
__name(ZodFunction, "ZodFunction");
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
__name(ZodLazy, "ZodLazy");
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
__name(ZodLiteral, "ZodLiteral");
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
__name(createZodEnum, "createZodEnum");
var ZodEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
__name(ZodEnum, "ZodEnum");
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
__name(ZodNativeEnum, "ZodNativeEnum");
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
__name(ZodPromise, "ZodPromise");
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
__name(ZodEffects, "ZodEffects");
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name(ZodOptional, "ZodOptional");
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name(ZodNullable, "ZodNullable");
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
__name(ZodDefault, "ZodDefault");
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
__name(ZodCatch, "ZodCatch");
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
__name(ZodNaN, "ZodNaN");
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
__name(ZodBranded, "ZodBranded");
var ZodPipeline = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }, "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
__name(ZodPipeline, "ZodPipeline");
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, "freeze");
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name(ZodReadonly, "ZodReadonly");
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function custom(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
}
__name(custom, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name(() => booleanType().optional(), "oboolean");
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// routes/data.ts
var scientistSchema = z.array(
  z.object({
    id: z.number({ message: "Id should be a number" }),
    name: z.string(),
    nationality: z.string(),
    description: z.string(),
    date_of_birth: z.string().date("Date should follow the format of YYYY-MM-DD"),
    date_of_death: z.string().date("Date should follow the format of YYYY-MM-DD").nullable(),
    discoveries: z.array(
      z.string({ message: "Array items should be strings" })
    ),
    nobel_prize: z.array(
      z.object({
        category: z.string(),
        year: z.number().gte(1901, {
          message: "Nobel prizes started being awarded in the year 1901"
        }),
        study: z.string()
      })
    ).nullable(),
    other_awards: z.array(z.string()).nullable()
  })
);
var scientistsData = [
  // Aage Bohr
  {
    id: 1,
    name: "Aage N Bohr",
    nationality: "Danish",
    description: "Aage Bohr was awarded the Nobel Prize in Physics in 1975 for his work detailing the structure of the atomic nucleus",
    date_of_birth: "1922-06-19",
    date_of_death: "2009-09-08",
    discoveries: ["Detailing the structure of the atomic nucleus"],
    nobel_prize: [
      {
        category: "Physics",
        year: 1975,
        study: "Detailing the structure of the atomic nucleus"
      }
    ],
    other_awards: null
  },
  // Abdus Salam
  {
    id: 2,
    name: "Abdus Salam",
    nationality: "Indian",
    description: "was a Pakistani theoretical physicist",
    date_of_birth: "1926-01-29",
    date_of_death: "1996-11-21",
    discoveries: [
      "Electroweak theory",
      "Goldstone boson",
      "Grand Unified Theory",
      "Higgs mechanism",
      "Magnetic photon",
      "Neutral current",
      "Pati\u2013Salam model",
      "Quantum mechanics",
      "Pakistan atomic research program",
      "Pakistan space program",
      "Preon",
      "Standard Model",
      "Strong gravity",
      "Superfield",
      "W and Z bosons"
    ],
    nobel_prize: null,
    other_awards: [
      "Smith's Prize (1950)",
      "Adams Prize (1958)",
      "Sitara-e-Pakistan (1959)",
      "Hughes Medal (1964)",
      "Atoms for Peace Prize (1968)",
      "Royal Medal (1978)",
      "Matteucci Medal (1978)",
      "Nobel Prize in Physics (1979)",
      "Nishan-e-Imtiaz (1979)",
      "Lomonosov Gold Medal (1983)",
      "Copley Medal (1990)"
    ]
  },
  // Albert Einstein
  {
    id: 3,
    name: "Albert Einstein",
    nationality: "German",
    description: "German-born theoretical physicist who is widely held as one of the most influential scientists. Best known for developing the theory of relativity",
    date_of_birth: "1879-03-14",
    date_of_death: "1955-04-18",
    discoveries: [
      "General relativity and the equivalence principle",
      "Provided powerful evidence that atoms and molecules actually exist, through his analysis of Brownian motion",
      "Explained the photoelectric effect",
      "Hole argument and Entwurf theory",
      "Gravitational waves",
      "Wormholes",
      "Special relativity",
      "Unified field theory",
      "Equations of motion",
      "Bose\u2013Einstein statistics",
      "Wave\u2013particle duality",
      "Quantum mechanics",
      "Bose\u2013Einstein condensate",
      "EPR paradox",
      "E=hf (Planck\u2013Einstein relation)",
      "E=mc2 (mass\u2013energy equivalence)",
      "Rewrote the law of gravitation:  showed that matter causes space to curve, which produces gravity"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1921,
        study: "discovery of the law of the photoelectric effect"
      }
    ],
    other_awards: [
      "Copley medal (1925)",
      "Max Planck Medal (1929)",
      "Barnard Medal for Meritorious Service to Science (1920)",
      "Matteucci Medal (1921)",
      "ForMemRS (1921)",
      "Gold Medal of RAS (1926)",
      "Time Person of the Century (1999)",
      "Membership of NAS (1942)"
    ]
  },
  // Alessandro Volta
  {
    id: 4,
    name: "Alessandro Giuseppe Antonio Anastasio Volta",
    nationality: "Italian",
    description: "was an Italian physicist and chemist who was a pioneer of electricity and power",
    date_of_birth: "1745-02-18",
    date_of_death: "1827-03-05",
    discoveries: [
      "Invention of the electric cell",
      "Discovery of methane",
      "Law of capacitance",
      "Volt",
      "Voltage",
      "Voltmeter",
      "Volta potential",
      "Volta pistol",
      "Voltaic pile"
    ],
    nobel_prize: null,
    other_awards: [
      "ForMemRS (1791)",
      "Copley Medal (1794)",
      "Legion of Honour (1805)",
      "Order of the Iron Crown (1806)"
    ]
  },
  // Alhazen -> BC ERA
  // 	{
  // 	    id: 5,
  // 	    name: "Alhazen Ibn al-Haytham",
  // 	    nationality: "Egyptian",
  // 	    description: "was a pioneering Arab polymath, mathematician, astronomer, and physicist during the Islamic Golden Age. He is often regarded as the father of modern optics and made groundbreaking contributions to the scientific method, experimental physics, and the study of light and vision",
  // 	    date_of_birth: "c.965",
  // 	    date_of_death: "c.1040",
  // 	    discoveries: [
  // 			"Optics (theory of light and vision)",
  // 			"Scientific method (empirical experimentation)",
  // 			"Camera obscura principles",
  // 			"Refraction and reflection laws",
  // 			"Anatomy of the eye (cornea, lens, optic nerve)",
  // 			"Alhazen's problem(mathematical optics)",
  // 			"Critique of Ptolemic astronomy",
  // 			"Early concepts of inertia and momentum"
  // 			],
  // 	    nobel_prize: null,
  // 	    other_awards: null,
  // 	},
  // Amedeo Avogadro
  {
    id: 5,
    name: "Lorenzo Romano Amedeo Carlo Avogadro",
    nationality: "Italian",
    description: "was an Italian scientist, most noted for his contribution to molecular theory now known as Avogadro's law, which states that equal volumes of gases under the same conditions of temperature and pressure will contain equal numbers of molecules.",
    date_of_birth: "1776-08-09",
    date_of_death: "1856-07-09",
    discoveries: ["Avogadro's constant", "Avogadro's law"],
    nobel_prize: null,
    other_awards: null
  },
  // Anaximander
  // {
  //     id: 7,
  //     name: "Anaximander",
  //     nationality: "Turkish",
  //     description: "About Anaximander",
  //     date_of_birth: "1776-08-09",
  //     date_of_death: "1856-07-09",
  //     discoveries: [],
  //     nobel_prize: [],
  //     other_awards: []
  // },
  // Andre-Marie Ampere
  {
    id: 6,
    name: "Andr\xE9-Marie Amp\xE8re",
    nationality: "French",
    description: "was a French physicist and mathematician who was one of the founders of the science of classical electromagnetism, which he referred to as electrodynamics",
    date_of_birth: "1775-01-20",
    date_of_death: "1836-06-10",
    discoveries: [
      "Amp\xE8re's circuital law",
      "Amp\xE8re's force law",
      "Amp\xE8re's right hand grip rule",
      "Amp\xE8rian loop model",
      "Avogadro-Amp\xE8re hypothesis",
      "Monge\u2013Amp\xE8re equation",
      "Discovery of fluorine",
      "Needle telegraph",
      "Solenoid"
    ],
    nobel_prize: null,
    other_awards: ["FRS (1827)"]
  },
  // Archimedes
  // {
  //     id: 9,
  //     name: "Archimedes",
  //     nationality: "Italian",
  //     description: "About Archimedes",
  //     date_of_birth: "1775-01-20",
  //     date_of_death: "1836-06-10",
  //     discoveries: [],
  //     nobel_prize: [],
  //     other_awards: []
  // },
  // Aristotle
  // {
  //     id: 10,
  //     name: "Aristotle",
  //     nationality: "Greek",
  //     description: "About Aristotle",
  //     date_of_birth: "1775-01-20",
  //     date_of_death: "1836-06-10",
  //     discoveries: [],
  //     nobel_prize: [],
  //     other_awards: []
  // },
  // Arthur Compton
  {
    id: 7,
    name: "Arthur Holly Compton",
    nationality: "U.S",
    description: "American physicist who won the Nobel Prize in Physics in 1927 for his 1923 discovery of the Compton effect, which demonstrated the particle nature of electromagnetic radiation.",
    date_of_birth: "1892-09-10",
    date_of_death: "1962-03-15",
    discoveries: [
      "Compton scattering",
      "Compton wavelength",
      "Compton\u2013Getting effect",
      "Compton generator"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1927,
        study: "description"
      }
    ],
    other_awards: [
      "Matteucci Medal (1930)",
      "Franklin Medal (1940)",
      "Hughes Medal (1940)",
      "Medal for Merit (1946)"
    ]
  },
  // Benjamin Franklin
  {
    id: 8,
    name: "Benjamin Franklin",
    nationality: "U.S",
    description: " was an American polymath: a leading writer, scientist, inventor, statesman, diplomat, printer, publisher and political philosopher.",
    date_of_birth: "1705-01-17",
    date_of_death: "1790-04-17",
    discoveries: [
      "He invented the Bifocal Spectacles",
      "The Franklin Stove",
      "The Lightning Rod",
      "Shaping our understanding of electricity",
      "Refrigeration",
      "Founded the American Philosophical Society"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Bernhard Riemann
  {
    id: 9,
    name: "Georg Friedrich Bernhard Riemann",
    nationality: "German",
    description: "was a German mathematician who made profound contributions to analysis, number theory, and differential geometry.",
    date_of_birth: "1826-09-17",
    date_of_death: "1866-07-20",
    discoveries: [
      "Free Riemann gas also called primon gas",
      "Riemann invariant",
      "Riemann\u2013Cartan geometry",
      "Riemann\u2013Silberstein vector",
      "Riemann-Lebovitz formulation",
      "Riemann curvature tensor also called Riemann tensor",
      "Riemann tensor (general relativity)"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Blaise Pascal
  {
    id: 10,
    name: "Blaise Pascal",
    nationality: "French",
    description: "French mathematician, physicist, inventor, philosopher, and Catholic writer.",
    date_of_birth: "1623-06-19",
    date_of_death: "1662-08-19",
    discoveries: [
      "Probability theory",
      "Pascal distribution",
      "Pascal's wager",
      "Pascal's triangle",
      "Pascal's law",
      "Pascal's rule",
      "Pascal's theorem",
      "Pascal's calculator"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Brian Greene
  {
    id: 11,
    name: "Brian Randolph Greene",
    nationality: "American",
    description: "American physicist known for his research on string theory",
    date_of_birth: "1963-02-09",
    date_of_death: null,
    discoveries: [
      "String theory",
      "The Elegant Universe",
      "The Fabric of the Cosmos",
      "The Hidden Reality"
    ],
    nobel_prize: null,
    other_awards: ["Andrew Gemant Award (2003)"]
  },
  // C.V. Raman
  {
    id: 12,
    name: "Sir Chandrasekhara Venkata Raman",
    nationality: "Indian",
    description: "Indian physicist known for his work in the field of light scattering.",
    date_of_birth: "1888-11-07",
    date_of_death: "1970-11-21",
    discoveries: ["Raman scattering (Raman effect)", "Raman spectroscopy"],
    nobel_prize: [
      {
        category: "Physics",
        year: 1930,
        study: "Raman effect or Raman scattering"
      }
    ],
    other_awards: [
      "Fellow of the Royal Society (1924)",
      "Matteucci Medal (1928)",
      "Knight Bachelor (1930)",
      "Hughes Medal (1930)",
      "Bharat Ratna (1954)",
      "Lenin Peace Prize (1957)"
    ]
  },
  // Carl Anderson
  {
    id: 13,
    name: "Carl David Anderson",
    nationality: "U.S",
    description: "He is best known for his discovery of the positron in 1932, an achievement for which he received the 1936 Nobel Prize in Physics, and of the muon in 1936",
    date_of_birth: "1905-09-03",
    date_of_death: "1991-01-11",
    discoveries: [
      "Carl Anderson discovered the positron in 1932, proving the existence of antimatter",
      "He discovered the muon in 1936"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1936,
        study: "Raman effect or Raman scattering"
      }
    ],
    other_awards: ["Elliott Cresson Medal (1937)"]
  },
  // Carl Friedrich Gauss
  {
    id: 14,
    name: "Carl Friedrich Gauss",
    nationality: "German",
    description: "Was a German mathematician, generally regarded as one of the greatest mathematicians of all time.",
    date_of_birth: "1777-04-30",
    date_of_death: "1855-02-23",
    discoveries: [
      "Geometry",
      "Number theory",
      "Probability theory",
      "Geodesy",
      "Known for Construction of the Heptadecagon",
      "Number Theory",
      "discoveries of the Dwarf Planet Ceres",
      "Disquisitiones Arithmeticae: Investigations in Arithmetic",
      "Inventing the Heliotrope, The Magnetic Field and SI Units",
      "The Telegraph",
      "Kirchoff\u2019s Circuit Laws",
      "Gauss\u2019s Law & Gauss\u2019s Law for Magnetism",
      "Gauss\u2019s incredible calculating power allowed him to find patterns in numbers more readily than most mathematicians. It enabled him to discover the prime number theorem when he was a teenager",
      "The normal distribution/bell curve is often called the Gaussian distribution, because Gauss discovered it",
      "Although not the first person to use complex numbers, he defined them, establishing the modern notation, and he applied complex numbers to solve problems in science",
      "He opened up the field of differential geometry and published the Theorema Egregium, relating surface curvature to distances and angles."
    ],
    nobel_prize: null,
    other_awards: ["Copley Medal (1838)"]
  },
  // Charles Barkla
  {
    id: 15,
    name: "Charles Glover Barkla",
    nationality: "English",
    description: "About Charles Glover Barkla",
    date_of_birth: "1877-06-07",
    date_of_death: "1944-10-23",
    discoveries: [
      "Known for Construction of the Heptadecagon",
      "Number Theory",
      "discoveries of the Dwarf Planet Ceres",
      "Disquisitiones Arithmeticae: Investigations in Arithmetic",
      "Inventing the Heliotrope, The Magnetic Field and SI Units",
      "The Telegraph",
      "Kirchoff\u2019s Circuit Laws",
      "Gauss\u2019s Law & Gauss\u2019s Law for Magnetism",
      "Gauss\u2019s incredible calculating power allowed him to find patterns in numbers more readily than most mathematicians. It enabled him to discover the prime number theorem when he was a teenager",
      "The normal distribution/bell curve is often called the Gaussian distribution, because Gauss discovered it",
      "Although not the first person to use complex numbers, he defined them, establishing the modern notation, and he applied complex numbers to solve problems in science",
      "He opened up the field of differential geometry and published the Theorema Egregium, relating surface curvature to distances and angles."
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Charles Townes
  {
    id: 16,
    name: "Charles Hard Townes",
    nationality: "American",
    description: "About Charles Hard Townes",
    date_of_birth: "1915-07-28",
    date_of_death: "2015-01-27",
    discoveries: [
      "Masers",
      "Lasers",
      "Astrophysical maser",
      "Infrared Spatial",
      "Interferometer",
      "Stimulated Brillouin scattering",
      "Townes-Schawlow linewidth",
      "Townes Solution",
      "Autler\u2013Townes effect"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1964,
        study: "Contributions to fundamental work in quantum electronics leading to the development of the maser and laser."
      }
    ],
    other_awards: [
      "Comstock Prize in Awards Physics (1958)",
      "John J. Carty Award (1961)",
      "Stuart Ballantine (1962)",
      "Young Medal and Prize (1963)",
      "IEEE Medal of Honor (1967)",
      "Wilhelm Exner Medal (1970)",
      "ForMemRS (1976)",
      "Earle K. Plyler Prize for Molecular Spectroscopy (1977)",
      "National Medal of Science (1982)",
      "Lomonosov Gold Medal (2000)",
      "Templeton Prize (2005)",
      "Vannevar Bush Award (2006)",
      "SPIE Gold Medal (2010)",
      "Golden Goose Award (2012)"
    ]
  },
  // Chen Ning Yang
  {
    id: 17,
    name: "Yang Chen-Ning",
    nationality: "Chinese",
    description: "Also known as C. N. Yang or by the English name Frank Yang, is a Chinese theoretical physicist who made significant contributions to statistical mechanics, integrable systems, gauge theory, and both particle physics and condensed matter physics",
    date_of_birth: "1922-10-01",
    date_of_death: null,
    discoveries: ["placeholder discoveries"],
    nobel_prize: [
      {
        category: "Physics",
        year: 1957,
        study: "Parity violation theory"
      }
    ],
    other_awards: [
      "Ten Outstanding Young Americans (1957)",
      "Rumford Prize (1980)",
      "National Medal of Science (1986)",
      "Oskar Klein Memorial Lecture and Medal (1988)",
      "Benjamin Franklin Medal for Distinguished Achievement in the Sciences of the American",
      "Philosophical Society (1993)",
      "Bower Award (1994)",
      "Albert Einstein Medal (1995)",
      "Lars Onsager Prize (1999)",
      "King Faisal International Prize (2001)"
    ]
  },
  // Chien-Shiung Wu
  {
    id: 18,
    name: "Chien-Shiung Wu",
    nationality: "Chinese",
    description: "Chinese-American particle and experimental physicist who made significant contributions in the fields of nuclear and particle physics",
    date_of_birth: "1912-05-31",
    date_of_death: "1997-02-16",
    discoveries: [
      "Manhattan Project",
      "Nuclear fission",
      "Wu experiment",
      "Parity violation",
      "Beta decay",
      "Quantum entanglement"
    ],
    nobel_prize: null,
    other_awards: [
      "Comstock Prize in Physics (1964)",
      "Bonner Prize (1975)",
      "National Medal of Science (1975)",
      "Wolf Prize in Physics (1978)"
    ]
  },
  // Daniel Bernoulli
  {
    id: 19,
    name: "Daniel Bernoulli",
    nationality: "Swiss",
    description: "Most distinguished of the second generation of the Bernoulli family os Swiss mathematicians.",
    date_of_birth: "1700-02-08",
    date_of_death: "1782-03-17",
    discoveries: [
      "Put forward Bernoulli's principle",
      "Established the basis for the kinetic theory of gases.",
      "He wrote Exercitationes quaedam Mathematicae on differential equations and the physics of flowing water",
      "Researched properties of vibrating and rotating bodies and contributed to probability theory"
    ],
    nobel_prize: null,
    other_awards: ["10 Prizes from Paris Academy of Sciences"]
  },
  // David Gross
  {
    id: 20,
    name: "David Gross",
    nationality: "U.S",
    description: "Graduted from Hebrew University of Jerusalem in 1962 and received a Ph.D in physics from University of California.",
    date_of_birth: "1941-02-19",
    date_of_death: null,
    discoveries: [
      "Did research in supestring theory and coinventor of a new supestring model in 1987",
      "Quantum Chromodynamics (QCD)"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 2004,
        study: "Together with David Politzer and Frank Wilczek discovered strong force - nuclear force that binds together quarks(the smallest building blocks of matter) and hold together the nucleus of the atom."
      }
    ],
    other_awards: [
      "Numerous awards from a MacArthur Foundation fellowship (1987)"
    ]
  },
  // David Hilbert
  {
    id: 21,
    name: "David Hilbert",
    nationality: "German",
    description: "German mathematician who reduced geometry to a series of axioms and contributed to the establishment of the formalistic foundations of mathematics.",
    date_of_birth: "1862-01-23",
    date_of_death: "1943-02-14",
    discoveries: [
      "His work in integral equations led to research in functional analysis",
      "Hilbert\u2019s Basis Theorem of Proof",
      "Hilbert\u2019s Axioms of Geometry",
      "Hilbert\u2019s 23 research Problems",
      "Hilbert space",
      "The Gravitational Field Equations of General Relativity",
      "Hilbert Space and Hilbert\u2019s Program: Logic and the Foundation of Mathematics"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // // Democritus
  // {
  //     "id": 26,
  //     "name": "Democritus",
  //     "description": "lkdjhbvnwndbmsncldjfbcj",
  //     "nationality": "Ancient Greek city of Abdera.",
  //     "date_of_birth": 460,
  //     "date_of_death": 370,
  //     "discoveries": [
  //         "He is famous for his atomic theory featuring tiny particles always in motion interacting through collisions",
  //         "His belief that the universe is governed entirely by natural, mechanistic laws rather than gods",
  //         "His description of a universe containing an infinity of diverse inhabited worlds",
  //         "His assertion that nothing is actually something",
  //         "His deduction that the light of stars explains the Milky Way’s appearance",
  //         "His discoveries that a cone’s volume is one-third that of the cylinder with the same base and height"
  //     ]
  // },
  // Amalie Emmy Noether
  {
    id: 22,
    name: "Amalie Emmy Noether",
    nationality: "German",
    description: "German mathematician whose innovations in higher algebra gained her recognition as the most creative abstract algebraist of modern times",
    date_of_birth: "1882-03-23",
    date_of_death: "1935-04-14",
    discoveries: [
      "Discovered that if Lagrangian does not change when the coordinate system changes, then there is quantity that is conserved",
      "Noether's Theorem",
      "Built up the theory of noncommutative algebras"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Enrico Fermi
  {
    id: 23,
    name: "Enrico Fermi",
    nationality: "Italian",
    description: "Was an Italian born American scientist who was one of the chief architects of the nuclear age.",
    date_of_birth: "1901-09-29",
    date_of_death: "1954-11-28",
    discoveries: [
      "He developed the mathematical statistics required to clarify a large class of subatomic phenomena",
      "Explored nuclear transformations caused by neutrons, and directed the first controlled chain reaction",
      "Fermi-Dirac Statistics",
      "Fermi paradox (Where is everybody)",
      "Nuclear chain reaction"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1938,
        study: "Nuclear chain reaction"
      }
    ],
    other_awards: null
  },
  // Ernest Orlando Lawrence
  {
    id: 24,
    name: "Ernest Orlando Lawrence",
    nationality: "U.S",
    description: "Was an American phycist who invented the cyclotron, the first particle accelerator",
    date_of_birth: "1901-08-08",
    date_of_death: "1958-08-27",
    discoveries: [
      "Invented the first particle accelerator",
      "Invented and patented a colour-television picture tube",
      "Worked on the Manhattan Project as program chief in charge of the development of the electromagnetic process separating uranium-235 for the atomic bomb"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1939,
        study: "Invention of the cyclotron"
      }
    ],
    other_awards: ["Award from U.S Atomic Energy Commission (1957)"]
  },
  // Ernest Rutherford
  {
    id: 25,
    name: "Ernest Rutherford",
    nationality: "New Zealand",
    description: "He was a New Zeland-born British physicist considered the greatest experimentalist since Michael Faraday.",
    date_of_birth: "1871-08-30",
    date_of_death: "1937-10-19",
    discoveries: [
      "Atomic nucleus",
      "Artificial Disintegration",
      "Radioactivity",
      "Rutherford model",
      "Alpha, Beta, and Gamma Radiation",
      "Radioactive Half-Lives"
    ],
    nobel_prize: [
      {
        category: "Chemistry",
        year: 1908,
        study: "Radioactivity"
      }
    ],
    other_awards: ["Copley Medal (1922)"]
  },
  // Ernest Walton
  {
    id: 26,
    name: "Ernest Walton",
    nationality: "Ireland",
    description: "He is best known for his work with John Cockcroft to construct one of the earliest types of particle accelerator",
    date_of_birth: "1903-10-06",
    date_of_death: "1995-06-25",
    discoveries: [
      "Cockcroft\u2013Walton generator.",
      "Splitting the atom",
      "Credited with being the first to disintegrate the lithium nucleus by bombardment with accelerated protons",
      "Identifying helium nuclei in the products in 1930"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1951,
        study: "Splitting the atom"
      }
    ],
    other_awards: ["Hughes Medal (1938)", "MRIA (1935)"]
  },
  // Erwin Schrodinger
  {
    id: 27,
    name: "Erwin Rudolf Josef Alexander Schrodinger",
    nationality: "Austrian",
    description: "Recognized for postulating the Schrodinger equation.",
    date_of_birth: "1887-08-12",
    date_of_death: "1961-01-04",
    discoveries: [
      "Schrodinger equation",
      "Shrodinger's cat",
      "Cat state",
      "Schrodinger method",
      "Schrodinger group",
      "Schrodinger picture",
      "Schrodinger field",
      "Rayleigh-Schrodinger pertubation",
      "Robertson-Schrodinger uncertainty relations",
      "Schrodinger-HJW theorem",
      "Schrodinger's pure-affine theory",
      "Coherent states",
      "Energy level",
      "Entropy and life",
      "Negentropy",
      "Interpretations of quantum mechanics",
      "Qualia",
      "Quantum Biology",
      "Quantum Entanglement",
      "Quantum Superposition",
      "Quantum Steering",
      "Zitterbewegung"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1933,
        study: "Formulation of Schrodinger equation"
      }
    ],
    other_awards: [
      "Haitinger Prize (1920)",
      "Matteucci Medal (1927)",
      "Max Planck Medal (1937)",
      "Erwin Schrodinger Prize (1956)",
      "Honorary membership of the Royal irish Academy (1931)"
    ]
  },
  // Evangelista Torricelli
  {
    id: 28,
    name: "Evangelista Torricelli",
    nationality: "Italian",
    description: "An Italian physicist and mathematician and a student of Galileo.",
    date_of_birth: "1608-10-15",
    date_of_death: "1647-10-25",
    discoveries: [
      "Suction pumps and the Barometer",
      "Torricelli's experiment",
      "Torricelli's equation",
      "Torricelli's law regarding the speed of fluid flowing out an opening",
      "Torricelli's trumpet aka Gabriel's Trumpet",
      "Torricellian vaccum",
      "Cause of the wind"
    ],
    nobel_prize: null,
    other_awards: [
      "Statue of Torricelli in gratitude to him (1868)",
      "Asteroid 7437 Torricelli and a crater on the moon named in his honour",
      "Genus of flowering plants named after him (1830)"
    ]
  },
  // Francis Crick
  {
    id: 29,
    name: "Francis Harry Compton Crick",
    nationality: "British",
    description: "An English molecular biologist, biophysicist and neuroscientist",
    date_of_birth: "1916-06-08",
    date_of_death: "2004-07-28",
    discoveries: [
      "DNA structure",
      "Central dogma",
      "Consciousness",
      "Adaptor hypothesis"
    ],
    nobel_prize: [
      {
        category: "Physiology/Medicine",
        year: 1962,
        study: "DNA structure"
      }
    ],
    other_awards: [
      "Albert Lasker Award (1960)",
      "Gairdner Foundation International Award (1962)",
      "Mendel Medal (1966)",
      "Royal Medal (1972)",
      "Copley Medal (1972)",
      "Sir Hans Krebs Medal (1977)",
      "Albert Medal (1987)",
      "Golden Plate Award (1987)",
      "Order of Merit (1991)"
    ]
  },
  // Frank Wilczek
  {
    id: 30,
    name: "Frank Wilczek",
    nationality: "U.S",
    description: "Contributed to the study of questions relating to cosmology, condensed matter physics and blackholes",
    date_of_birth: "1951-05-15",
    date_of_death: null,
    discoveries: [
      "Did research in supestring theory and coinventor of a new supestring model in 1987",
      "Quantum Chromodynamics (QCD)"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 2004,
        study: "Together with David J.Gross and H. David Politzer discovered strong force - nuclear force that binds together quarks(the smallest building blocks of matter) and hold together the nucleus of the atom."
      }
    ],
    other_awards: [
      "MacArthur Foundation fellowship (1982)",
      "Trempleton Prize(2022)"
    ]
  },
  // Fred Hoyle
  {
    id: 31,
    name: "Sir Fred Hoyle",
    nationality: "British",
    description: "Was an English astronomer who formulated the thoery of stellar nucleosynthesis",
    date_of_birth: "1915-06-24",
    date_of_death: "2001-08-20",
    discoveries: [
      "Coining th phrase 'Big Bang",
      "Steady-state-theory",
      "Stellar nucleosynthesis theory",
      "Triple-Alpha process",
      "Panspermia",
      "Hoyle's fallacy",
      "Hoyle's model",
      "B2FH Paper",
      "Hoyle-Narlikar theory",
      "Bondi-Hoyle-Lyttleton",
      "Accretion"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1974,
        study: "Leading role in the discovery of pulsars"
      },
      {
        category: "Physics",
        year: 1983,
        study: "THeoretical and experimental studies of the nuclear reactions of importance in the formation of the chemical elements in the universe"
      }
    ],
    other_awards: [
      "Gold Medal of the Royal Astronomical Society (1968)",
      "Bakerian Lecture (1968)",
      "Bruce Medal (1970)",
      "Henry Norris Russell Lectureship (1971)",
      "Knighthood (1972)",
      "Royal Medal (1974)",
      "Klumpke-Roberts Award (1977)",
      "Balzan Prize (1994)",
      "Crafoord Prize (1997)"
    ]
  },
  // Galileo Galilei
  {
    id: 32,
    name: "Galileo di Vincenzo Bonaiuti de' Galilei",
    nationality: "Italian",
    description: "commonly referred to as Galileo Galilei  or mononymously as Galileo, was an Italian (Florentine)[a] astronomer, physicist and engineer,sometimes described as a polymath",
    date_of_birth: "1564-02-15",
    date_of_death: "1642-01-08",
    discoveries: [
      "Celatone",
      "Analytical dynamics",
      "Frictionless plane",
      "Galileo number",
      "Galileo thermometer",
      "Galileo's ship",
      "Galileo's escapement",
      "Galileo's experiment",
      "Galileo's law of odd numbers",
      "Galileo's objective lens",
      "Galileo's paradox",
      "Galileo's problem",
      "Galileo's sector",
      "Galilean equivalency principle",
      "Galilean invariance",
      "Galilean moons",
      "Galilean telescope",
      "Galilean transformation",
      "Heliocentrism",
      "Inertia",
      "Pendulum clock",
      "Phases of Venus",
      "Rings of Saturn",
      "Square-cube law"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Georg Ohm
  {
    id: 33,
    name: "Georg Simon Ohm",
    nationality: "German",
    description: "German physicist and mathematician",
    date_of_birth: "1789-03-16",
    date_of_death: "1854-07-06",
    discoveries: ["Ohm's law", "Ohm's accoustic law", "Ohm"],
    nobel_prize: null,
    other_awards: ["Copley medal (1841)"]
  },
  // Guglielmo Marconi
  {
    id: 34,
    name: "Guglielmo Marconi",
    nationality: "Italian",
    description: "Worked on the development of shortwave wireless communication.",
    date_of_birth: "1874-04-25",
    date_of_death: "1937-07-20",
    discoveries: ["Radiotelegraphy"],
    nobel_prize: [
      {
        category: "Physics",
        year: 1909,
        study: "Hertzian wave"
      }
    ],
    other_awards: null
  },
  // Hans Bethe
  {
    id: 35,
    name: "Hans Albrecht Bethe",
    nationality: "German-American",
    description: "He was a theoretical physicist who made major contributions to nuclear physics, astrophysics, quantum electrodynamics, and solid-state physics",
    date_of_birth: "1906-07-02",
    date_of_death: "2005-03-06",
    discoveries: [
      "Nuclear physics",
      "Stellar nucleosynthesis",
      "Quantum electrodynamics",
      "Cavity perturbation theory",
      "Crystal field theory",
      "Bethe\u2013Salpeter equation",
      "Bethe-Slater curve",
      "Bethe formula",
      "Bethe-Heitler formula",
      "Mott-Bethe formula",
      "Bethe lattice",
      "Bethe\u2013Feynman formula",
      "Bethe ansatz",
      "Bethe\u2013Weizs\xE4cker formula",
      "Bethe\u2013Weizs\xE4cker process"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1967,
        study: "theory of stellar nucleosynthesis"
      }
    ],
    other_awards: [
      "A. Cressy Morrison Prize (1939)",
      "Henry Draper Medal (1947)",
      "Franklin Medal (1959)",
      "Eddington Medal (1961)",
      "Enrico Fermi Award (1961)",
      "Rumford Prize (1963)",
      "Nat'l Medal of Science (1975)",
      "Lomonosov Gold Medal (1989)",
      "Oersted Medal (1993)",
      "Bruce Medal (2001)",
      "Benjamin Franklin Medal (2005)"
    ]
  },
  // Hans Christian Ørsted
  {
    id: 36,
    name: "Hans Christian \xD8rsted",
    nationality: "Danish",
    description: "A Danish physicist and chemist who discovered that electric currents create magnetic fields",
    date_of_birth: "1777-08-14",
    date_of_death: "1851-03-09",
    discoveries: [
      "Oersted's law",
      "Discovery of aluminium",
      "Thought experiment Oersted"
    ],
    nobel_prize: null,
    other_awards: [
      "Copley Medal (1820)",
      "ForMemRS (1821)",
      "FRSE (1821)",
      "Pour le M\xE9rite (1842)"
    ]
  },
  // Heinrich Hertz
  {
    id: 42,
    name: "Heinrich Rudolf Hertz",
    nationality: "German",
    description: "German physicist who first conclusively proved the existence of the electromagnetic waves",
    date_of_birth: "1857-02-22",
    date_of_death: "1894-01-01",
    discoveries: [
      "Hertzian wave",
      "Contact mechanics",
      "Emagram",
      "Parabollic antenna",
      "Photoelectric effect",
      "Hertzian cone",
      "Hertzian dipole antenna",
      "Hertzian oscillator",
      "Hertzian vector",
      "Hertzian-Knudsen equation",
      "Hertz's principle of least curvature"
    ],
    nobel_prize: null,
    other_awards: ["Matteucci Medal Awards (1888)", "Rumford Medal (1890)"]
  },
  // Henry Moseley
  {
    id: 43,
    name: "Henry Gwyn Jeffreys Moseley",
    nationality: "English",
    description: "Physicist whose contribution to the science of physics was the justification from physical laws of\nthe previous empirical and chemical concept of the atomic number",
    date_of_birth: "1887-11-23",
    date_of_death: "1915-08-10",
    discoveries: ["Atomic number", "Moseley's law"],
    nobel_prize: null,
    other_awards: ["Matteucci Medal (1919)"]
  },
  // Inge Lehmann
  {
    id: 44,
    name: "Inge Lehmann",
    nationality: "Danish",
    description: "Danish seismologist and geophysicist who is known for her discovery in 1936 of the solid inner core that exists within the molten outer core of the Earth.",
    date_of_birth: "1888-05-13",
    date_of_death: "1993-02-21",
    discoveries: ["Discovery of a solid inner core in earths crust"],
    nobel_prize: null,
    other_awards: ["William Bowie Medal (1971)"]
  },
  // Irene Joliot-Curie
  {
    id: 45,
    name: "Ir\xE8ne Joliot-Curie",
    nationality: "French",
    description: "French chemist, physicist and politician, the elder daughter of Pierre Curie and Marie Sk\u0142odowska\u2013Curie, and the wife of Fr\xE9d\xE9ric Joliot-Curie.",
    date_of_birth: "1897-09-12",
    date_of_death: "1956-03-17",
    discoveries: ["Discovery of induced radioactivity"],
    nobel_prize: [
      {
        category: "Chemistry",
        year: 1935,
        study: "Discovery of induced radioactivity"
      }
    ],
    other_awards: null
  },
  // Isaac Newton
  {
    id: 46,
    name: "Sir Isaac Newton",
    nationality: "English",
    description: "English polymath active as a mathematician, physicist, astronomer, alchemist, theologian, and author who was described in his time as a natural philosopher.",
    date_of_birth: "1642-10-25",
    date_of_death: "1726-03-20",
    discoveries: [
      "Newton's laws of motion",
      "Newtonian mechanics",
      "Gravitional forces",
      "Calculus",
      "Optics",
      "Binomial Series",
      "Newton's method",
      "Principia",
      "Newton's law of cooling",
      "Newtonian identities",
      "Newton's metal",
      "Newton line",
      "Newton-Gauss Line",
      "Newtonian fluid"
    ],
    nobel_prize: null,
    other_awards: ["FRS (1672)", "Bachelor (1705)"]
  },
  // J. J. Thompson
  {
    id: 47,
    name: "Sir Joseph John Thomson",
    nationality: "British",
    description: "British physicist and Nobel Laureate in Physics, credited with the discovery of the electron",
    date_of_birth: "1856-12-18",
    date_of_death: "1940-08-30",
    discoveries: [
      "Plum pudding model",
      "Discovery of electron",
      "Discovery of isotopes",
      "Mass spectrometer invention",
      "Electromagnetic mass",
      "First m/e measurement",
      "Proposed first waveguide",
      "Gibbs\u2013Thomson equation",
      "Thomson scattering",
      "Thomson problem",
      "Coining term 'delta ray",
      "Coining term 'epsilon radiation'",
      "Thomson (unit)"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1906,
        study: "Conduction of electricity in gases"
      }
    ],
    other_awards: [
      "Smith's Prize (1880)",
      "Royal Medal (1894)",
      "Hughes Medal (1902)",
      "Elliott Cresson Medal (1910)",
      "Copley Medal (1914)",
      "Albert Medal (1915)",
      "Franklin Medal (1922)",
      "Faraday Medal (1925)",
      "Dalton Medal (1931)"
    ]
  },
  // J. Robert Oppenheimer
  {
    id: 48,
    name: "Julius Robert Oppenheimer",
    nationality: "American",
    description: "American theoretical physicist who served as the director of the Manhattan Project's Los Alamos Laboratory during World War II. Also know as father of the atomic bomb",
    date_of_birth: "1904-04-22",
    date_of_death: "1967-02-18",
    discoveries: [
      "Atomic bomb",
      "Oppenheimer\u2013Snyder model",
      "Tolman\u2013Oppenheimer\u2013Volkoff equation",
      "Tolman\u2013Oppenheimer\u2013Volkoff limit",
      "Oppenheimer\u2013Phillips process",
      "Born\u2013Oppenheimer approximation"
    ],
    nobel_prize: null,
    other_awards: ["Medal for Merit (1946)", "Enrico Fermi Award (1963)"]
  },
  // James Chadwick
  {
    id: 49,
    name: "Sir James Chadwick",
    nationality: "American",
    description: "English physicist who was awarded the 1935 Nobel Prize in Physics for his discovery of the neutron in 1932",
    date_of_birth: "1891-10-20",
    date_of_death: "1974-07-24",
    discoveries: [
      "Discovery of the neutron",
      "MAUD Committee Report",
      "Manhattan Project"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1935,
        study: "Discovery of the neutron"
      }
    ],
    other_awards: [
      "Fellow of the Royal Society (1927)",
      "Hughes Medal (1932)",
      "Knight Bachelor (1945)",
      "Melchett Medal (1946)",
      "Copley Medal (1950)",
      "Faraday Medal (1950)",
      "Franklin Medal (1951)",
      "Guthrie Medal and Prize (1967)",
      "Member of the Order of the Companions of Honour (1970)"
    ]
  },
  // James Clerk Maxwell
  {
    id: 50,
    name: "James Clerk Maxwell",
    nationality: "Scottish",
    description: "Scottish physicist and mathematician who was responsible for the classical theory of electromagnetic radiation",
    date_of_birth: "1831-06-13",
    date_of_death: "1879-11-05",
    discoveries: [
      "Electromagnetism",
      "Colour vision",
      "Kinetic theory and thermodynamics",
      "Control theory"
    ],
    nobel_prize: null,
    other_awards: [
      "Smith's Prize (1854)",
      "Adams Prize (1857)",
      "Rumford Medal (1860)",
      "FRS (1861)",
      "Bakerian Medal (1866)",
      "Keith Medal (1869\u20131871)"
    ]
  },
  // Johannes Kepler
  {
    id: 51,
    name: "Johannes Kepler",
    nationality: "German",
    description: "He is a key figure in the 17th-century Scientific Revolution, best known for his laws of planetary motion",
    date_of_birth: "1571-12-27",
    date_of_death: "1630-11-15",
    discoveries: [
      "Kepler's laws of planetary motion",
      "Kepler conjecture",
      "Rudolphine Tables",
      "Astronomia Nova",
      "Mysterium Cosmographicum",
      "Harmonice Mundi"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // John Bardeen
  {
    id: 52,
    name: "John Bardeen",
    nationality: "American",
    description: "He is the only person to be awarded the Nobel Prize in Physics twice: first in 1956 with William Shockley and Walter Brattain for the invention of the transistor; and again in 1972 with Leon N. Cooper and John Robert Schrieffer for a fundamental theory of conventional superconductivity known as the BCS theory.",
    date_of_birth: "1908-05-23",
    date_of_death: "1991-01-30",
    discoveries: [
      "Point-contact transistor",
      "Field-effect transistor",
      "BCS theory",
      "Superconductivity",
      "Surface physics",
      "Deformation potential theory",
      "Bardeen's formalism",
      "Mattis\u2013Bardeen theory"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1956,
        study: "Invention of the transistor"
      },
      {
        category: "Physics",
        year: 1972,
        study: "BCS theory."
      }
    ],
    other_awards: [
      "Stuart Ballantine medal (1952)",
      "Oliver E. Buckley Solid State Prize (1954)",
      "Fritz London Memorial Prize (1962)",
      "National Medal of Science (1965)",
      "IEEE Medal of Honor (1971)",
      "ForMemRS (1973)",
      "Franklin Medal (1975)",
      "Lomonosov Gold Medal (1987)"
    ]
  },
  // John Cockcroft
  {
    id: 53,
    name: "Sir John Douglas Cockcroft",
    nationality: "English",
    description: "was an English physicist who shared with Ernest Walton the Nobel Prize in Physics in 1951 for splitting the atomic nucleus, and was instrumental in the development of nuclear power.",
    date_of_birth: "1897-05-27",
    date_of_death: "1967-09-18",
    discoveries: ["Splitting the atom"],
    nobel_prize: [
      {
        category: "Physics",
        year: 1951,
        study: "placeholder"
      }
    ],
    other_awards: [
      "FRS (1936)",
      "Hughes Medal (1938)",
      "Order of the British Empire (1944)",
      "Medal of Freedom (1947)",
      "Knighthood (1948)",
      "Order of the Bath (1953)",
      "Royal Medal (1954)",
      "Faraday Medal (1955)",
      "Military Order of Christ (1955)",
      "Order of Merit (1957)",
      "Civil Order of Alfonso X, the Wise (1958)",
      "Atoms for Peace Award (1961)",
      "Wilhelm Exner Medal (1961)"
    ]
  },
  // John Michell
  {
    id: 54,
    name: "John Michell",
    nationality: "English",
    description: "Considered 'one of the greatest unsung scientists of all time', he is the first person known to have proposed the existence of stellar bodies comparable to black holes, and the first to have suggested that earthquakes travelled in (seismic) waves.",
    date_of_birth: "1724-12-25",
    date_of_death: "1793-04-21",
    discoveries: [
      "Predicting the existence of black holes, seismology, manufacture of magnets, mass of the Earth"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // John Philoponus
  // {
  //     id: 55,
  //     name: "John Philoponus",
  // 	nationality: "Greek",
  // 	description:
  // 		"Considered 'one of the greatest unsung scientists of all time', he is the first person known to have proposed the existence of stellar bodies comparable to black holes, and the first to have suggested that earthquakes travelled in (seismic) waves.",
  // 	date_of_birth: "1724-12-25",
  // 	date_of_death: "1793-04-21",
  // 	discoveries: [
  // 		"Predicting the existence of black holes, seismology, manufacture of magnets, mass of the Earth",
  // 	],
  // 	nobel_prize: null,
  // 	other_awards: null,
  // }
  // John Wallis
  {
    id: 56,
    name: "John Wallis",
    nationality: "English",
    description: "Was an English clergyman and mathematician, who is given partial credit for the development of infinitesimal calculus.",
    date_of_birth: "1616-11-23",
    date_of_death: "1703-10-28",
    discoveries: [
      "Wallis product",
      "Inventing the symbol \u221E",
      "Extending Cavalieri's quadrature formula",
      "Coining the term 'momentum'"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Joseph Henry
  {
    id: 57,
    name: "Joseph Henry",
    nationality: "American",
    description: "American physicist and inventor who served as the first secretary of the Smithsonian Institution",
    date_of_birth: "1797-12-17",
    date_of_death: "1878-05-13",
    discoveries: [
      "Doorbell",
      "Electromagnet",
      "Electromagnetic induction",
      "Relay",
      "Henry (unit)"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Joseph-Louis Lagrange
  {
    id: 58,
    name: "Joseph-Louis Lagrange",
    nationality: "Italian",
    description: "was an Italian mathematician, physicist and astronomer, later naturalized French. He made significant contributions to the fields of analysis, number theory, and both classical and celestial mechanics.",
    date_of_birth: "1736-01-25",
    date_of_death: "1813-04-10",
    discoveries: [
      "Lagrangian analysis",
      "Lagrangian coordinates",
      "Lagrangian derivative",
      "Lagrangian drifter",
      "Lagrangian foliation",
      "Lagrangian Grassmannian",
      "Lagrangian intersection Floer homology",
      "Lagrangian mechanics",
      "Lagrangian (field theory)",
      "Lagrangian system",
      "Lagrangian mixing",
      "Lagrangian point",
      "Lagrangian relaxation",
      "Lagrangian submanifold",
      "Lagrangian subspace",
      "Nonlocal Lagrangian",
      "Proca lagrangian",
      "Special Lagrangian submanifold",
      "Euler\u2013Lagrange equation",
      "Green\u2013Lagrange strain",
      "Lagrange bracket",
      "Lagrange\u2013B\xFCrmann formula",
      "Lagrange\u2013d'Alembert principle",
      "Lagrange error bound",
      "Lagrange form",
      "Lagrange form of the remainder",
      "Lagrange interpolation",
      "Lagrange invariant",
      "Lagrange inversion theorem",
      "Lagrange multiplier",
      "Lagrange number",
      "Lagrange point colonization",
      "Lagrange polynomial",
      "Lagrange property",
      "Lagrange reversion theorem",
      "Lagrange resolvent",
      "Lagrange spectrum",
      "Lagrange stability",
      "Lagrange stream function",
      "Lagrange top",
      "Lagrange\u2212Sylvester interpolation",
      "Lagrange's approximation theorem",
      "Lagrange's formula",
      "Lagrange's identity",
      "Lagrange's identity (boundary value problem)",
      "Lagrange's mean value theorem",
      "Lagrange's notation",
      "Lagrange's theorem (group theory)",
      "Lagrange's theorem (number theory)",
      "Lagrange's four-square theorem",
      "Lagrange's trigonometric identities"
    ],
    nobel_prize: null,
    other_awards: null
  },
  {
    id: 59,
    name: "Kip Stephen Thorne",
    description: "Is an American theoretical physicist and writer known for his contributions in gravitational physics and astrophysics.",
    nationality: "American",
    date_of_birth: "1940-06-01",
    date_of_death: null,
    discoveries: [
      "Gravitational waves and LIGO",
      "Black hole cosmology",
      "Wormholes and time travel",
      "Relativistic stars, multipole moments and other endeavors"
    ],
    nobel_prize: null,
    other_awards: [
      "American Academy of Arts and Sciences (1972)",
      "National Academy of Sciences",
      "Russian Academy of Sciences",
      "American Philosophical Society."
    ]
  },
  // Lawrence Bragg
  {
    id: 60,
    name: "Sir William Lawrence Bragg",
    description: "Also known as Lawrence Bragg, was an Australian-born British physicist and X-ray crystallographer, discoverer (1912) of Bragg's law of X-ray diffraction, which is basic for the determination of crystal structure. ",
    nationality: "Australian",
    date_of_birth: "1890-03-31",
    date_of_death: "1971-07-01",
    discoveries: ["X-rays and the Bragg equation", "Work on sound ranging"],
    nobel_prize: [
      {
        category: "Physics",
        year: 1915,
        study: "Analysis of crystal structures by means of X-rays"
      }
    ],
    other_awards: [
      "Hughes Medal (1931)",
      "Royal Medal (1946)",
      "Guthrie Lecture (1952)",
      "Copley Medal (1966)"
    ]
  },
  // Lisa Randall
  {
    id: 61,
    name: "Lisa Randall",
    description: " American theoretical physicist",
    nationality: "American",
    date_of_birth: "1962-06-18",
    date_of_death: null,
    discoveries: ["American theoretical physicist"],
    nobel_prize: null,
    other_awards: [
      "J.J. Sakurai Prize for Theoretical Particle Physics 2019",
      "Andrew Gemant Award, 2012",
      "Golden Plate Award of the American Academy of Achievement, 2008",
      "Lilienfeld Prize, 2007",
      "E. A. Wood Science Writing Award, 2007",
      "Klopsteg Memorial Award from the American Association of Physics Teachers (AAPT), 2006",
      "Premio Caterina Tomassoni e Felice Pietro Chisesi, from the Sapienza University of Rome, 2003",
      "National Science Foundation Young Investigator Award, 1992"
    ]
  },
  // Lise Meitner
  {
    id: 62,
    name: "Elise Meitner",
    description: " Austrian-Swedish nuclear physicist who was instrumental in the discovery of nuclear fission",
    nationality: "Austrian",
    date_of_birth: "1878-11-07",
    date_of_death: "1968-10-27",
    discoveries: ["Nuclear fission", "Transmutation", "Beta radiation"],
    nobel_prize: null,
    other_awards: null
  },
  {
    id: 63,
    name: "William Thomson, 1st Baron Kelvin",
    description: "British mathematician, mathematical physicist and engineer.",
    nationality: "British",
    date_of_birth: "1824-06-26",
    date_of_death: "1907-12-17",
    discoveries: [
      "Thermoelectric Thomson effect",
      "Kelvin bridge (also known as Thomson bridge)",
      "Kelvin functions",
      "Kelvin\u2013Helmholtz instability",
      "Kelvin\u2013Helmholtz luminosity",
      "Kelvin\u2013Helmholtz mechanism",
      "Kelvin\u2013Voigt material",
      "Joule\u2013Thomson effect",
      "Kelvin sensing",
      "Kelvin transform in potential theory",
      "Kelvin wake pattern",
      "Kelvin water dropper",
      "Kelvin wave",
      "Kelvin's heat death paradox",
      "Kelvin's circulation theorem",
      "Kelvin\u2013Stokes theorem",
      "Kelvin\u2013Varley divider",
      "The SI unit of temperature, kelvin"
    ],
    nobel_prize: null,
    other_awards: [
      "Fellow of the Royal Society of Edinburgh, 1847.",
      "Keith Medal, 1864.",
      "Gunning Victoria Jubilee Prize, 1887.",
      "President, 1873\u20131878, 1886\u20131890, 1895\u20131907.",
      "Foreign member of the Royal Swedish Academy of Sciences, 1851.",
      "Fellow of the Royal Society, 1851.",
      "Royal Medal, 1856.",
      "Copley Medal, 1883.",
      "President, 1890\u20131895.",
      "Hon. Member of the Royal College of Preceptors (College of Teachers), 1858.",
      "Hon. Member of the Institution of Engineers and Shipbuilders in Scotland, 1859.",
      "Knighted 1866.",
      "Commander of the Imperial Order of the Rose (Brazil), 1873. ",
      "Commander of the Legion of Honour (France), 1881.",
      "Grand Officer of the Legion of Honour, 1889.",
      "Knight of the Prussian Order Pour le M\xE9rite, 1884.",
      "Commander of the Order of Leopold (Belgium), 1890.",
      "Baron Kelvin, of Largs in the County of Ayr, 1892.",
      "Knight Grand Cross of the Victorian Order, 1896.",
      "Honorary degree Legum doctor (LL.D.), Yale University, 5 May 1902.",
      "One of the first members of the Order of Merit, 1902.",
      "Privy Counsellor, 11 August 1902.",
      "Honorary degree Doctor mathematicae from the Royal Frederick University on 6 September 1902",
      "First international recipient of John Fritz Medal, 1905.",
      "Order of the First Class of the Sacred Treasure of Japan, 1901."
    ]
  },
  // Luis Alvarez
  {
    id: 64,
    name: "Luis Walter Alvarez",
    description: "American experimental physicist, inventor, and Nobel laureate known for groundbreaking work in particle physics, radar technology, and the asteroid-impact theory of dinosaur extinction.",
    nationality: "American",
    date_of_birth: "1911-06-03",
    date_of_death: "1988-09-01",
    discoveries: [
      "Co-developed the Alvarez hypothesis (with Walter Alvarez) linking the Cretaceous-Paleogene extinction to an asteroid impact",
      "Nobel Prize in Physics (1968) for development of the hydrogen bubble chamber and discoveries in particle physics",
      "Pioneered radar systems during WWII (Ground-Controlled Approach for aircraft landing)",
      "Contributed to the Manhattan Project (detonation observer and explosives expert)",
      "Discovered the 'Alvarez Parity' phenomenon in particle physics",
      "Developed novel techniques for detecting subatomic particles using liquid hydrogen",
      "Advanced muon-catalyzed fusion research",
      "Coined the term 'Little Boy' for the atomic bomb dropped on Hiroshima",
      "Used cosmic rays to search for hidden chambers in Egyptian pyramids (1960s)",
      "Authored influential papers on geophysics, optics, and aviation technology",
      "Held patents for radar navigation systems and color television technology"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Marie Curie
  {
    id: 65,
    name: "Maria Salomea Sk\u0142odowska-Curie",
    description: "Polish physicist and chemist, pioneer in radioactivity research. First woman Nobel laureate and first person to win Nobel Prizes in two scientific fields (Physics and Chemistry)",
    nationality: "Polish",
    date_of_birth: "1867-11-07",
    date_of_death: "1934-07-04",
    discoveries: [
      "Discovery of polonium and radium (first isolation of radioactive isotopes)",
      "Pioneering research on radioactivity (term the coined)",
      "First woman awarded a Nobel Prize (1903, Physics) for radiation studies",
      "Second Nobel Prize (1911, Chemistry) for isolating pure radium",
      "Development of mobile X-ray units ('Little Curies') during World War I",
      "Established the theory of radioactive decay and atomic transmutation",
      "Techniques for isolating radioactive isotopes for medical use",
      "Founded the Curie Institutes in Paris and Warsaw, advancing cancer research",
      "First female professor at the University of Paris (Sorbonne)",
      "Early studies linking radiation to tumor treatment"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Masatoshi Koshiba
  {
    id: 66,
    name: "Masatoshi Koshiba",
    description: "Japanese physicist and Nobel laureate renowned for pioneering neutrino astronomy. His work revolutionized the detection and understanding of neutrinos, fundamental particles in the universe.",
    nationality: "Japanese",
    date_of_birth: "1926-09-19",
    date_of_death: "2020-11-12",
    discoveries: [
      "Nobel Prize in Physics (2002) for detecting cosmic neutrinos and contributions to astrophysics",
      "Designed and led the Kamiokande and Super-Kamiokande neutrino observatories",
      "First detection of neutrinos from the Sun (solar neutrinos), confirming the solar fusion process",
      "Observed neutrinos from Supernova 1987A, providing the first direct evidence of stellar collapse",
      "Confirmed neutrino oscillations, proving neutrinos have mass (key to the Standard Model of particle physics)",
      "Advanced the field of neutrino astronomy, enabling study of cosmic events via neutrino detection",
      "Mentored future leaders in particle physics and astrophysics",
      "Advocated for international collaboration in large-scale physics experiments",
      "Authored influential works on particle physics and astrophysics"
    ],
    nobel_prize: null,
    other_awards: null
  },
  //	Max Born
  {
    id: 67,
    name: "Max Born",
    description: "German-British physicist and mathematician, foundational to quantum mechanics. Nobel laureate for his statistical interpretation of the wave function.",
    nationality: "German-British",
    date_of_birth: "1882-12-11",
    date_of_death: "1970-01-05",
    discoveries: [
      "Nobel Prize in Physics (1954) for the statistical interpretation of quantum mechanics",
      "Developed the Born rule, linking wave functions to probabilities of particle positions",
      "Pioneered matrix mechanics (with Werner Heisenberg and Pascual Jordan), a foundation of quantum theory",
      "Introduced the concept of the Born approximation in scattering theory",
      "Coined the term 'quantum mechanics'",
      "Advanced the theory of crystal lattices and lattice dynamics",
      "Mentored future Nobel laureates, including Werner Heisenberg and Wolfgang Pauli",
      "Advocated for the ethical use of science and nuclear disarmament",
      "Authored influential texts like *Atomic Physics* and *Principles of Optics* (with Emil Wolf)",
      "Played a key role in the development of quantum electrodynamics (QED)"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Max Planck
  {
    id: 68,
    name: "Max Karl Ernst Ludwig Planck ",
    description: "German theoretical physicist whose discovery of energy quanta won him the Nobel Prize in Physics in 1918",
    nationality: "German",
    date_of_birth: "1858-04-23",
    date_of_death: "1947-10-04",
    discoveries: [
      "Nobel Prize in Physics (1918) for the discovery of energy quanta",
      "Formulated Planck's law of black-body radiation, introducing the quantum of action (Planck constant, h)",
      "Laid the foundation for quantum mechanics with the concept of quantized energy",
      "Derived the Planck-Einstein relation (E = h\u03BD), linking energy to frequency",
      "Developed the concept of entropy and its role in thermodynamics",
      "Pioneered the study of quantum theory, influencing Einstein, Bohr, and Heisenberg",
      "Introduced the idea of zero-point energy",
      "Played a key role in the development of the theory of heat radiation",
      "Advocated for the unity of physics and the philosophical implications of quantum theory",
      "Founded the Kaiser Wilhelm Society (now Max Planck Society), a leading scientific institution"
    ],
    nobel_prize: null,
    other_awards: null
  },
  // Michael Faraday
  {
    id: 69,
    name: "Michael Faraday",
    nationality: "British",
    description: "British scientist who made groundbreaking contributions to electromagnetism and electrochemistry, laying the foundation for electric power technology.",
    date_of_birth: "1791-09-22",
    date_of_death: "1867-08-25",
    discoveries: [
      "Electromagnetic induction",
      "Electrolysis laws",
      "Diamagnetism",
      "Faraday effect (interaction between light and magnetism)",
      "Faraday cage (shielding effect of conductors)",
      "Relationship between electricity and magnetism",
      "Discovered benzene",
      "Developed early concepts of electric and magnetic fields"
    ],
    nobel_prize: null,
    other_awards: [
      "Royal Medal (1835, 1846)",
      "Copley Medal (1832, 1838)",
      "Rumford Medal (1846)",
      "Albert Medal (1866)",
      "Foreign Member of the Royal Society"
    ]
  },
  // Michio Kaku
  {
    id: 70,
    name: "Michio Kaku",
    nationality: "American",
    description: "American theoretical physicist, futurist, and popular science communicator known for his work in string field theory and his efforts to make science accessible to the public.",
    date_of_birth: "1947-01-24",
    date_of_death: null,
    discoveries: [
      "Contributions to string field theory",
      "Developed the first functional string field theory equations",
      "Explored higher-dimensional space-time in theoretical physics",
      "Popularized the concept of a 'Theory of Everything'",
      "Advocated for the potential of parallel universes and the multiverse"
    ],
    nobel_prize: null,
    other_awards: [
      "Kloppesteg Memorial Award",
      "Sir Arthur Clarke Award for Science Communication",
      "Isaac Asimov Science Award"
    ]
  },
  // Murray Gell-Mann
  {
    id: 71,
    name: "Murray Gell-Mann",
    nationality: "American",
    description: "American physicist who was instrumental in the development of the quark model, greatly advancing the field of particle physics",
    date_of_birth: "1929-09-15",
    date_of_death: "2019-05-24",
    discoveries: [
      "Quark model",
      "Eightfold Way (classification of hadrons)",
      "Quantum chromodynamics (QCD)",
      "Gell-Mann matrices",
      "Current algebra",
      "Strangeness (quantum number in particle physics)",
      "Renormalization group",
      "Totalitarian principle ('Everything not forbidden is compulsory')",
      "Deep connections between fundamental physics and complexity theory"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1969,
        study: "contributions and discoveries concerning the classification of elementary particles and their interactions"
      }
    ],
    other_awards: [
      "Albert Einstein Award (1959)",
      "Ernest Orlando Lawrence Award (1966)",
      "Franklin Medal (1967)",
      "National Medal of Science (1988)",
      "Max Planck Medal (1997)",
      "Foreign Member of the Royal Society (ForMemRS, 1978)"
    ]
  },
  // Nicolo Tartaglia
  {
    id: 72,
    name: "Nicolo Tartaglia",
    nationality: "Italian",
    description: "Italian mathematician, engineer, and ballistics expert. Known for solving cubic equations and his contributions to the science of ballistics and mechanics during the Renaissance.",
    date_of_birth: "1499-12-13",
    date_of_death: "1557-12-13",
    discoveries: [
      "Developed a method for solving cubic equations (Tartaglia's formula)",
      "Pioneered the study of ballistics and projectile motion",
      "Authored *Nova Scientia*, a foundational work on the science of ballistics",
      "Translated and preserved ancient Greek mathematical texts, including Euclid's *Elements*",
      "Contributed to the understanding of mechanics and geometry",
      "Studied the trajectories of cannonballs and other projectiles",
      "Introduced mathematical rigor to the study of artillery and fortifications"
    ],
    nobel_prize: null,
    other_awards: [
      "Legacy honored through the Tartaglia crater on the Moon",
      "Recognized as a key figure in the Renaissance revival of mathematics and science",
      "His work influenced later mathematicians like Gerolamo Cardano and Galileo Galilei"
    ]
  },
  // Neils Bohr
  {
    id: 73,
    name: "Neils Bohr",
    nationality: "Danish",
    description: "Danish physicist and Nobel laureate, foundational to quantum mechanics and atomic theory. Developed the Bohr model of the atom and contributed to the Copenhagen interpretation of quantum mechanics",
    date_of_birth: "1885-10-07",
    date_of_death: "1962-11-18",
    discoveries: [
      "Developed the Bohr model of the atom, explaining electron orbits and energy levels",
      "Introduced the concept of complementarity in quantum mechanics",
      "Co-founded the Copenhagen interpretation of quantum mechanics",
      "Explained atomic spectra and the hydrogen atom's emission lines",
      "Contributed to the theory of nuclear fission and the liquid drop model",
      "Played a key role in the Manhattan Project's early stages",
      "Founded the Niels Bohr Institute in Copenhagen",
      "Authored influential works on atomic structure and quantum theory"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1922,
        study: "investigations of atomic structure and radiation"
      }
    ],
    other_awards: [
      "Max Planck Medal (1930)",
      "Copley Medal (1938)",
      "Franklin Medal (1926)",
      "Order of the Elephant (Denmark's highest honor, 1947)",
      "Foreign Member of the Royal Society (London)",
      "Honorary doctorates from over 30 universities",
      "Legacy honored through the Bohr model, Bohr radius, and Niels Bohr Institute",
      "Considered one of the founders of modern quantum mechanics"
    ]
  },
  // Nikola Tesla
  {
    id: 74,
    name: "Nikola Tesla",
    nationality: "Serbian-American",
    description: "Serbian-American inventor, electrical engineer, and futurist. Pioneer of alternating current (AC) electrical systems, wireless communication, and numerous groundbreaking innovations in electromagnetism and energy transmission",
    date_of_birth: "1856-07-10",
    date_of_death: "1943-01-07",
    discoveries: [
      "Designed the modern alternating current (AC) electricity supply system",
      "Invented the Tesla coil (foundational to wireless technology and radio transmission)",
      "Developed principles of wireless communication and radio technology",
      "Patented the induction motor and transformer",
      "Pioneered X-ray imaging experiments and high-frequency currents",
      "Proposed wireless energy transmission (Wardenclyffe Tower project)",
      "Invented remote control technology (teleautomaton)",
      "Designed the Tesla turbine and bladeless turbine engine",
      "Advocated for global wireless communication and renewable energy systems"
    ],
    nobel_prize: null,
    other_awards: [
      "Edison Medal (1917)",
      "Order of St. Sava (Serbia, 1892)",
      "Elliott Cresson Medal (1894)",
      "John Scott Medal (1934)",
      "Honorary doctorates from Columbia and Zagreb Universities",
      "Unit of magnetic flux density (tesla) named in his honor",
      "Inducted into the National Inventors Hall of Fame (1975)"
    ]
  },
  // Paul Dirac
  {
    id: 75,
    name: "Paul Dirac",
    nationality: "British",
    description: "British theoretical physicist and Nobel laureate, known for his foundational contributions to quantum mechanics and quantum electrodynamics. Formulated the Dirac equation, predicting antimatter",
    date_of_birth: "1902-08-08",
    date_of_death: "1984-10-20",
    discoveries: [
      "Formulated the Dirac equation, unifying quantum mechanics and special relativity",
      "Predicted the existence of antimatter (positrons)",
      "Developed the theory of quantum electrodynamics (QED)",
      "Introduced the concept of Dirac spinors and the Dirac delta function",
      "Pioneered the use of bra-ket notation in quantum mechanics",
      "Contributed to the development of the path integral formulation of quantum mechanics",
      "Authored *The Principles of Quantum Mechanics*, a foundational text in physics",
      "Studied magnetic monopoles and their implications for quantum theory"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1933,
        study: "discovery of new productive forms of atomic theory"
      }
    ],
    other_awards: [
      "Royal Medal (1939)",
      "Copley Medal (1952)",
      "Max Planck Medal (1952)",
      "Fellow of the Royal Society (1930)",
      "Honorary doctorates from numerous universities",
      "Legacy honored through the Dirac Medal (ICTP)",
      "Considered one of the founders of modern quantum mechanics"
    ]
  },
  // Pyotr Kapitsa
  {
    id: 76,
    name: "Pyotr Kapitsa",
    nationality: "Russian",
    description: "Soviet physicist and Nobel laureate, known for his work in low-temperature physics and the discovery of superfluidity in liquid helium. A pioneer in cryogenics and strong magnetic fields.",
    date_of_birth: "1894-07-08",
    date_of_death: "1984-04-08",
    discoveries: [
      "Discovered superfluidity in liquid helium-4 (1937)",
      "Developed innovative techniques for producing strong magnetic fields",
      "Pioneered the study of high-intensity microwave electronics",
      "Invented the Kapitza-Dirac effect, demonstrating electron diffraction by light",
      "Studied the properties of liquid helium and its phase transitions",
      "Contributed to the development of cryogenic engineering and low-temperature physics",
      "Authored foundational works on plasma physics and superconductivity",
      "Founded the Institute for Physical Problems in Moscow"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1978,
        study: "basic inventions and discoveries in the area of low-temperature physics"
      }
    ],
    other_awards: [
      "Lomonosov Gold Medal (1959)",
      "Rutherford Medal and Prize (1966)",
      "Order of Lenin (multiple times)",
      "Foreign Member of the Royal Society (London)",
      "Honorary doctorates from numerous universities",
      "Legacy honored through the Kapitza Institute in Moscow",
      "Considered one of the founders of modern low-temperature physics"
    ]
  },
  // Richard A. Muller
  {
    id: 77,
    name: "Richard A. Muller",
    nationality: "American",
    description: "American physicist known for his work in climate science, astrophysics, and geophysics. Founder of the Berkeley Earth project, which analyzes global temperature data, and a prominent science communicator",
    date_of_birth: "1944-01-06",
    date_of_death: null,
    discoveries: [
      "Co-founded the Berkeley Earth project to refine and validate global climate temperature records",
      "Proposed the Nemesis hypothesis, suggesting a stellar companion to the Sun influencing comet dynamics",
      "Conducted pioneering research on dark matter distribution in the Milky Way",
      "Developed methods for analyzing cosmic microwave background radiation anisotropies",
      "Authored influential works on climate science, including *Physics for Future Presidents*",
      "Investigated the causes of mass extinctions and asteroid impacts",
      "Contributed to the understanding of radioisotope dating techniques",
      "Advanced public understanding of energy and climate through accessible science writing"
    ],
    nobel_prize: null,
    other_awards: [
      "MacArthur Fellowship (Genius Grant, 1982)",
      "Leo Szilard Award for Physics in the Public Interest (1984)",
      "Fellow of the American Physical Society",
      "Professor Emeritus at the University of California, Berkeley",
      "Author of popular science books: *Physics for Future Presidents* and *The Instant Physicist*",
      "Legacy honored through the Berkeley Earth initiative's global climate analyses"
    ]
  },
  // Richard Feynman
  {
    id: 78,
    name: "Richard Feynman",
    nationality: "American",
    description: "American theoretical physicist, Nobel laureate, and charismatic science communicator. Revolutionized quantum electrodynamics (QED), developed Feynman diagrams, and contributed to particle physics, superfluidity, and quantum computing",
    date_of_birth: "1918-05-11",
    date_of_death: "1988-02-15",
    discoveries: [
      "Formulated quantum electrodynamics (QED), explaining interactions between light and matter",
      "Invented Feynman diagrams, a visual tool for particle interactions",
      "Developed the path integral formulation of quantum mechanics",
      "Explained superfluidity in liquid helium",
      "Proposed the parton model, advancing quark theory",
      "Co-authored the Feynman Lectures on Physics, a landmark in physics education",
      "Investigated the Challenger disaster as part of the Rogers Commission",
      "Pioneered concepts in quantum computing (Feynman's version of the Church-Turing thesis)",
      "Worked on the Manhattan Project, contributing to atomic bomb development"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1965,
        study: "fundamental work in quantum electrodynamics, with profound consequences for particle physics"
      }
    ],
    other_awards: [
      "Albert Einstein Award (1954)",
      "Oersted Medal (1972)",
      "National Medal of Science (1979)",
      "Foreign Member of the Royal Society (London)",
      "Ernest Orlando Lawrence Award (1962)",
      "Honorary doctorates from over 30 universities",
      "Named one of the 'Ten Greatest Physicists of All Time' by Physics World",
      "Legacy honored through the Feynman Prize in Nanotechnology",
      "Authored popular science books: *Surely You're Joking, Mr. Feynman!* and *What Do You Care What Other People Think?*"
    ]
  },
  // Robert Hooke
  {
    id: 79,
    name: "Robert Hooke",
    nationality: "English",
    description: "English natural philosopher, architect, and polymath, known for his contributions to physics, biology, and microscopy. A key figure in the Scientific Revolution.",
    date_of_birth: "1635-07-18",
    date_of_death: "1703-03-03",
    discoveries: [
      "Discovered Hooke's Law of elasticity, describing the behavior of springs",
      "Pioneered the use of the microscope, coining the term 'cell' in biology",
      "Published *Micrographia*, a groundbreaking work on microscopy and biology",
      "Studied the nature of light and wave theory, influencing later work on optics",
      "Contributed to the design of scientific instruments, including the compound microscope",
      "Proposed a wave theory of light and studied diffraction",
      "Made significant contributions to astronomy, including the study of comets and planets",
      "Designed buildings and structures, including the Royal Observatory at Greenwich",
      "Advocated for the scientific method and experimental philosophy"
    ],
    nobel_prize: null,
    other_awards: [
      "Fellow of the Royal Society (1663)",
      "Curator of Experiments for the Royal Society (1662\u20131677)",
      "Gresham Professor of Geometry (1665\u20131703)",
      "Legacy honored through the Hooke Medal (British Society for the History of Science)",
      "Considered one of the most influential scientists of the 17th century"
    ]
  },
  // Rodger Penrose
  {
    id: 80,
    name: "Rodger Penrose",
    nationality: "British",
    description: "British mathematical physicist, mathematician, and philosopher of science, renowned for his work on general relativity, black holes, and the nature of consciousness. Nobel laureate in Physics.",
    date_of_birth: "1931-08-08",
    date_of_death: null,
    discoveries: [
      "Proved the Penrose-Hawking singularity theorems, showing singularities are inevitable in general relativity",
      "Developed the theory of black hole formation and the cosmic censorship conjecture",
      "Invented Penrose tilings, aperiodic patterns with fivefold symmetry",
      "Proposed the Penrose process, a mechanism to extract energy from rotating black holes",
      "Contributed to twistor theory, a framework for unifying quantum mechanics and general relativity",
      "Studied the nature of spacetime and the geometry of the universe",
      "Authored *The Road to Reality*, a comprehensive guide to the laws of physics",
      "Explored the relationship between physics and consciousness in *The Emperor's New Mind*",
      "Made significant contributions to the study of gravitational waves and cosmology"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 2020,
        study: "discovery that black hole formation is a robust prediction of the general theory of relativity"
      }
    ],
    other_awards: [
      "Wolf Prize in Physics (1988)",
      "Copley Medal (2008)",
      "Royal Medal (1985)",
      "Albert Einstein Medal (1990)",
      "Fellow of the Royal Society (1972)",
      "Honorary doctorates from numerous universities",
      "Knighted for services to science (1994)",
      "Legacy honored through the Penrose Institute, exploring physics and consciousness"
    ]
  },
  // S. N. Bose
  {
    id: 81,
    name: "S. N. Bose",
    nationality: "Indian",
    description: "Indian physicist and mathematician, best known for his work on quantum mechanics and the development of Bose-Einstein statistics. The class of particles known as bosons is named in his honor",
    date_of_birth: "1894-01-01",
    date_of_death: "1974-02-04",
    discoveries: [
      "Developed Bose-Einstein statistics, describing the behavior of bosons",
      "Collaborated with Albert Einstein to predict the Bose-Einstein condensate",
      "Pioneered the study of quantum mechanics and statistical mechanics",
      "Contributed to the theory of the photon gas and blackbody radiation",
      "Authored the foundational paper on quantum statistics, sent to Einstein for validation",
      "Studied the properties of X-rays and crystallography",
      "Made significant contributions to the understanding of unified field theories",
      "Advocated for the development of science education in India"
    ],
    nobel_prize: null,
    other_awards: [
      "Padma Vibhushan (India's second-highest civilian award, 1954)",
      "Fellow of the Royal Society (1958)",
      "Honorary doctorates from numerous universities",
      "Legacy honored through the naming of bosons (particles obeying Bose-Einstein statistics)",
      "S.N. Bose National Centre for Basic Sciences (Kolkata) named in his honor",
      "Considered one of the founders of quantum statistics"
    ]
  },
  // Stephen Hawking
  {
    id: 82,
    name: "Stephen Hawking",
    nationality: "British",
    description: "British theoretical physicist, cosmologist, and author, renowned for his work on black holes, general relativity, and quantum mechanics. A cultural icon for his contributions to science and his resilience in the face of ALS.",
    date_of_birth: "1942-01-08",
    date_of_death: "2018-03-14",
    discoveries: [
      "Predicted that black holes emit radiation (Hawking radiation)",
      "Proposed the no-boundary condition for the origin of the universe",
      "Contributed to the understanding of singularities in general relativity",
      "Studied the thermodynamics of black holes and the information paradox",
      "Authored *A Brief History of Time*, one of the most popular science books of all time",
      "Developed the theory of cosmic inflation and the multiverse",
      "Collaborated on the Penrose-Hawking singularity theorems",
      "Explored the relationship between quantum mechanics and general relativity",
      "Made significant contributions to the study of the early universe and cosmology"
    ],
    nobel_prize: null,
    other_awards: [
      "Albert Einstein Medal (1979)",
      "Wolf Prize in Physics (1988)",
      "Copley Medal (2006)",
      "Presidential Medal of Freedom (2009)",
      "Special Breakthrough Prize in Fundamental Physics (2013)",
      "Fellow of the Royal Society (1974)",
      "Honorary doctorates from numerous universities",
      "Legacy honored through the Stephen Hawking Medal for Science Communication",
      "Stephen Hawking Fellowship (University of Cambridge)",
      "Considered one of the most influential scientists of the modern era"
    ]
  },
  // Steven Weinberg
  {
    id: 83,
    name: "Steven Weinberg",
    nationality: "American",
    description: "American theoretical physicist and Nobel laureate, known for his contributions to the unification of the weak force and electromagnetism, and for his work on the Standard Model of particle physics",
    date_of_birth: "1933-05-03",
    date_of_death: "2021-07-23",
    discoveries: [
      "Formulated the electroweak theory, unifying the weak force and electromagnetism",
      "Predicted the existence of the W and Z bosons and the Higgs mechanism",
      "Co-developed the Standard Model of particle physics",
      "Contributed to the understanding of quantum field theory and symmetry breaking",
      "Authored *The Quantum Theory of Fields*, a foundational text in theoretical physics",
      "Studied the cosmological constant problem and dark energy",
      "Proposed the Weinberg angle, a key parameter in the electroweak theory",
      "Made significant contributions to the theory of quantum chromodynamics (QCD)",
      "Advocated for the reductionist approach in physics"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1979,
        study: "contributions to the theory of the unified weak and electromagnetic interaction between elementary particles"
      }
    ],
    other_awards: [
      "National Medal of Science (1991)",
      "Albert Einstein Medal (1979)",
      "James Joyce Award (2009)",
      "Benjamin Franklin Medal (2004)",
      "Foreign Member of the Royal Society (London)",
      "Honorary doctorates from numerous universities",
      "Legacy honored through the Steven Weinberg Award (American Physical Society)",
      "Authored popular science books, including *The First Three Minutes* and *Dreams of a Final Theory*"
    ]
  },
  // SUBRAHMANYAN CHANDRASEKHAR
  {
    id: 84,
    name: "SUBRAHMANYAN CHANDRASEKHAR",
    nationality: "Indian-American",
    description: "Indian-American astrophysicist and Nobel laureate, known for his work on stellar structure, black holes, and the Chandrasekhar limit. A pioneer in theoretical astrophysics",
    date_of_birth: "1910-10-19",
    date_of_death: "1995-08-21",
    discoveries: [
      "Discovered the Chandrasekhar limit (1.4 solar masses), determining the fate of white dwarfs",
      "Developed the theory of stellar structure and evolution",
      "Pioneered the study of black holes and relativistic astrophysics",
      "Investigated the dynamics of stellar systems and radiative transfer",
      "Contributed to the theory of hydrodynamic and hydromagnetic stability",
      "Studied the mathematical theory of black holes and singularities",
      "Authored *An Introduction to the Study of Stellar Structure* and *The Mathematical Theory of Black Holes*",
      "Made significant contributions to the understanding of white dwarfs, neutron stars, and supernovae"
    ],
    nobel_prize: [
      {
        category: "Physics",
        year: 1983,
        study: "theoretical studies of the physical processes important to the structure and evolution of stars"
      }
    ],
    other_awards: [
      "National Medal of Science (1966)",
      "Copley Medal (1984)",
      "Royal Medal (1962)",
      "Henry Norris Russell Lectureship (1949)",
      "Padma Vibhushan (India's second-highest civilian award, 1968)",
      "Gold Medal of the Royal Astronomical Society (1953)",
      "Honorary doctorates from numerous universities",
      "Chandra X-ray Observatory named in his honor",
      "Legacy honored through the Chandrasekhar Prize (American Physical Society)"
    ]
  },
  // Thomas Young
  {
    id: 85,
    name: "Thomas Young",
    nationality: "British",
    description: "British polymath, physicist, and physician, known for his contributions to wave theory of light, vision, and deciphering the Rosetta Stone. A pioneer in multiple scientific fields.",
    date_of_birth: "1773-06-13",
    date_of_death: "1829-05-10",
    discoveries: [
      "Demonstrated the wave nature of light through the double-slit experiment",
      "Proposed the Young-Helmholtz theory of color vision (trichromatic theory)",
      "Deciphered parts of the Rosetta Stone, laying the groundwork for understanding Egyptian hieroglyphs",
      "Introduced the concept of energy in its modern scientific sense",
      "Studied elasticity and defined Young's modulus, a measure of material stiffness",
      "Investigated the mechanics of the eye and vision, including astigmatism",
      "Contributed to the understanding of surface tension and capillary action",
      "Authored *A Course of Lectures on Natural Philosophy and the Mechanical Arts*",
      "Pioneered the field of physiological optics"
    ],
    nobel_prize: null,
    other_awards: [
      "Fellow of the Royal Society (1794)",
      "Bakerian Lecture (1801, 1803, 1805)",
      "Royal Society's Rumford Medal (1802)",
      "Foreign Member of the Royal Swedish Academy of Sciences",
      "Honorary doctorates from several universities",
      "Legacy honored through the Thomas Young Medal and Prize (Institute of Physics)",
      "Considered one of the last true polymaths"
    ]
  },
  // Vera Rubin
  {
    id: 86,
    name: "Vera Rubin",
    nationality: "American",
    description: "American astronomer who pioneered work on galaxy rotation rates, providing key evidence for the existence of dark matter. A trailblazer for women in science",
    date_of_birth: "1928-07-23",
    date_of_death: "2016-12-25",
    discoveries: [
      "Provided observational evidence for dark matter through galaxy rotation curves",
      "Discovered the discrepancy between predicted and observed galactic rotation rates (Rubin-Ford effect)",
      "Pioneered the study of galaxy dynamics and large-scale structure in the universe",
      "Advocated for the existence of dark matter as a major component of the universe",
      "Studied the distribution of galaxies and their motions, contributing to cosmology",
      "Authored influential papers on galaxy clustering and dark matter",
      "Mentored numerous women in astronomy and advocated for gender equality in science"
    ],
    nobel_prize: [],
    other_awards: [
      "National Medal of Science (1993)",
      "Gold Medal of the Royal Astronomical Society (1996)",
      "Bruce Medal (2003)",
      "Gruber Prize in Cosmology (2002)",
      "James Craig Watson Medal (2004)",
      "Henry Norris Russell Lectureship (1994)",
      "Honorary doctorates from numerous universities",
      "Vera Rubin Observatory (under construction in Chile) named in her honor",
      "Legacy honored through the Vera Rubin Early Career Award (American Astronomical Society)"
    ]
  },
  // Werner Karl Heisenberg
  {
    id: 87,
    name: "Werner Karl Heisenberg",
    nationality: "German",
    description: "Was a German physicist and philosopher who discovered a way to formulate quantum mechanics in terms of matrices",
    date_of_birth: "1901-12-05",
    date_of_death: "1976-02-01",
    discoveries: [
      "Formulated the uncertainty principle, a cornerstone of quantum mechanics",
      "Developed matrix mechanics, the first complete formulation of quantum mechanics",
      "Contributed to the development of quantum field theory",
      "Proposed the isospin concept in nuclear physics",
      "Worked on the theory of ferromagnetism and the neutron-proton model of the nucleus",
      "Played a key role in the Copenhagen interpretation of quantum mechanics",
      "Authored influential works like *The Physical Principles of the Quantum Theory*",
      "Contributed to the understanding of turbulence in fluid dynamics",
      "Developed the S-matrix theory in particle physics"
    ],
    nobel_prize: [
      {
        "category": "Physics",
        "year": 1932,
        "study": "creation of quantum mechanics, particularly the uncertainty principle"
      }
    ],
    other_awards: [
      "Max Planck Medal (1933)",
      "Matteucci Medal (1929)",
      "Pour le M\xE9rite for Sciences and Arts (1957)",
      "Foreign Member of the Royal Society (London)",
      "Honorary doctorates from numerous universities",
      "Werner Heisenberg Medal (awarded by the Alexander von Humboldt Foundation)",
      "Legacy honored through the Heisenberg Prize (German Research Foundation)"
    ]
  },
  // J. Willard Gibbs
  {
    id: 88,
    name: "J. Willard Gibbs",
    nationality: "American",
    description: "American theoretical physicist and chemist, foundational to thermodynamics, statistical mechanics, and physical chemistry. His work laid the mathematical foundations for modern physics and chemistry.",
    date_of_birth: "1839-02-11",
    date_of_death: "1903-04-28",
    discoveries: [
      "Developed the Gibbs free energy concept, central to chemical thermodynamics",
      "Formulated the phase rule, explaining the equilibrium of heterogeneous systems",
      "Pioneered vector calculus and its application to physics",
      "Introduced the concept of chemical potential",
      "Developed statistical mechanics, linking microscopic and macroscopic physics",
      "Authored *On the Equilibrium of Heterogeneous Substances*, a cornerstone of physical chemistry",
      "Contributed to the Gibbs paradox in thermodynamics",
      "Developed the Gibbs-Helmholtz equation, relating enthalpy and free energy",
      "Introduced the Gibbs phenomenon in Fourier analysis",
      "Laid the groundwork for modern chemical thermodynamics and physical chemistry"
    ],
    nobel_prize: null,
    other_awards: [
      "Rumford Prize (1880)",
      "Foreign Member of the Royal Society (London)",
      "Gibbs free energy and Gibbs phase rule named in his honor",
      "Gibbs Lecturer (American Mathematical Society)",
      "Legacy honored through the Willard Gibbs Award (American Chemical Society)",
      "Considered one of the greatest theoretical scientists in American history"
    ]
  },
  // William Gilbert
  {
    id: 89,
    name: "William Gilbert",
    nationality: "English",
    description: "English physician, physicist, and natural philosopher, known as the father of electricity and magnetism. His pioneering work laid the foundation for the study of electromagnetism.",
    date_of_birth: "1544-05-24",
    date_of_death: "1603-11-30",
    discoveries: [
      "First systematic study of magnetism, published in *De Magnete* (1600)",
      "Introduced the concept of the Earth as a giant magnet, explaining compass behavior",
      "Distinguished between magnetic and static electric forces",
      "Coined the term 'electricus' (from Greek 'elektron', meaning amber), leading to the modern term 'electricity'",
      "Discovered that many substances could be electrified by friction",
      "Proposed that electricity and magnetism were separate phenomena",
      "Pioneered experimental methods in physics, emphasizing observation and experimentation",
      "Authored *De Magnete*, one of the first major scientific works based on experimental evidence"
    ],
    nobel_prize: null,
    other_awards: [
      "Considered the father of electricity and magnetism",
      "Gilbert (unit of magnetomotive force) named in his honor",
      "Recognized as a pioneer of the scientific method",
      "Legacy honored through the Gilbert Medal (awarded by the Royal Society of Chemistry)",
      "His work influenced later scientists like Galileo and Kepler"
    ]
  },
  // Wolfgang Pauli
  {
    id: 90,
    name: "Wolfgang Pauli",
    nationality: "Austrian",
    description: "Austrian theoretical physicist, one of the pioneers of quantum mechanics. Best known for the Pauli exclusion principle and his work on spin theory",
    date_of_birth: "1900-04-25",
    date_of_death: "1958-12-15",
    discoveries: [
      "Pauli exclusion principle (fundamental to quantum mechanics and atomic structure)",
      "Predicted the existence of the neutrino to explain beta decay",
      "Formulated the Pauli matrices, foundational to quantum spin theory",
      "Introduced the concept of spin and the spin-statistics theorem",
      "Contributed to the development of quantum field theory",
      "Worked on the CPT theorem (charge, parity, and time reversal symmetry)",
      "Collaborated with Niels Bohr and Werner Heisenberg on quantum theory",
      "Critiqued and refined early quantum mechanics, including the Bohr-Sommerfeld model",
      "Authored influential papers on quantum electrodynamics (QED) and particle physics"
    ],
    nobel_prize: [
      {
        "category": "Physics",
        "year": 1945,
        "study": "discovery of the Pauli exclusion principle"
      }
    ],
    other_awards: [
      "Matteucci Medal (1956)",
      "Max Planck Medal (1958)",
      "Lorentz Medal (1931)",
      "Franklin Medal (1952)",
      "Foreign Member of the Royal Society (London)",
      "Honorary doctorates from numerous universities",
      "Wolfgang Pauli Institute (Vienna) named in his honor"
    ]
  },
  // Herman Von Helmholtz
  {
    id: 91,
    name: "Herman Von Helmholtz",
    nationality: "German",
    description: "Was a German physicist and philosopher. Best known for his statement of the law of conservation of energy",
    date_of_birth: "1821-08-31",
    date_of_death: "1894-09-08",
    discoveries: [
      "Formulated the law of conservation of energy (First Law of Thermodynamics)",
      "Pioneered the study of nerve impulses and the speed of neural transmission",
      "Developed the theory of color vision (Young-Helmholtz trichromatic theory)",
      "Invented the ophthalmoscope, revolutionizing eye medicine",
      "Studied acoustics and the physics of sound, including the Helmholtz resonator",
      "Advanced the understanding of fluid dynamics and vortex motion",
      "Contributed to the principle of least action in mechanics",
      "Investigated the perception of sound and music, laying groundwork for psychoacoustics",
      "Authored seminal works like *On the Conservation of Force* and *Handbook of Physiological Optics*"
    ],
    nobel_prize: null,
    other_awards: [
      "Copley Medal (1873)",
      "Pour le M\xE9rite for Sciences and Arts (1873)",
      "Foreign Member of the Royal Society (London)",
      "Helmholtz Medal (established in his honor by the German Physical Society)",
      "Honorary doctorates from numerous universities",
      "Helmholtz Association of German Research Centres named in his honor",
      "Helmholtz-Zentrum Berlin (research institute) named in his honor"
    ]
  },
  // Joseph Black
  {
    id: 92,
    name: "Joseph Black",
    description: "Was a british chemist and physicist best known for the rediscoveries of fixed air (carbon dioxide).",
    nationality: "British",
    date_of_birth: "1728-04-16",
    date_of_death: "1799-12-06",
    discoveries: [
      "Discovered carbon dioxide (fixed air) and its properties",
      "Introduced the concept of latent heat, explaining phase changes in matter",
      "Developed the theory of specific heat, advancing calorimetry",
      "Pioneered quantitative methods in chemistry, laying groundwork for modern chemical analysis",
      "Demonstrated that carbon dioxide is produced by respiration and combustion",
      "Discovered magnesium and its compounds",
      "Studied the properties of alkalis and acids, contributing to the understanding of chemical reactions",
      "Influenced James Watt's improvements to the steam engine through his work on heat"
    ],
    nobel_prize: null,
    other_awards: null
  }
];
scientistSchema.parse(scientistsData);

// routes/physicists.ts
var physicist = new Hono2();
physicist.get("/", (c) => {
  return c.text("Welcome to the scientists API!");
});
physicist.get("/scientists", (c) => {
  return c.json(scientistsData);
});
physicist.get("/scientists/random", (c) => {
  return c.json(
    scientistsData[Math.floor(Math.random() * scientistsData.length)]
  );
});
physicist.get("/scientists/:scientist", (c) => {
  if (!c.req.param("scientist")) {
    return c.text("No scientist name provided");
  }
  const scientist = scientistsData.find(
    (person) => person.name.toLowerCase().includes(c.req.param("scientist").toLowerCase())
  );
  return scientist ? c.json(scientist) : c.notFound();
});
var physicists_default = physicist;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-cHQ2De/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = physicists_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-cHQ2De/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=physicists.js.map
