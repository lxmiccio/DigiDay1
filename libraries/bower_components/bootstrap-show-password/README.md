Bootstrap Show Password
=======================

Show/hide password plugin for twitter bootstrap.

## Demos

This plugin support bootstrap v2 and bootstrap v3.

[Live demo](http://wenzhixin.net.cn/p/bootstrap-show-password/)

## Usage

The plugin acts on `<input>` elements (typically password fields):

```html
<input id="password" class="form-control" type="password" data-toggle="password">
```

### Via data attributes
```html
<input data-toggle="password">
```

### Via JavaScript
```javascript
$('#password').password();
```

## Options

Options can be passed via data attributes or JavaScript.
For data attributes, append the option name to `data-`, as in `data-message="Show/hide password"`.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Attribute</th>
            <th>type</th>
            <th>default</th>
            <th>description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>-</td>
            <td>data-toggle</td>
            <td>String</td>
            <td>password</td>
            <td>Active password without writing JavaScript.</td>
        </tr>
        <tr>
            <td>placement</td>
            <td>data-placement</td>
            <td>String</td>
            <td>after</td>
            <td>The placement of show/hide icon, can be 'before' or 'after'.</td>
        </tr>
        <tr>
            <td>message</td>
            <td>data-message</td>
            <td>String</td>
            <td>Click here to show/hide password</td>
            <td>The tooltip of show/hide icon.</td>
        </tr>
        <tr>
            <td>white</td>
            <td>data-white</td>
            <td>Boolean</td>
            <td>false</td>
            <td>Show the white icon. (Just work in bootstrap v2)</td>
        </tr>
    </tbody>
</table>

## Methods

### .password('show')

Manually show the password.
```
$('#password).password('show');
```

### .password('hide')

Manually hide the password.
```
$('#password).password('hide');
```

### .password('toggle')

Manually toggle the password.
```
$('#password).password('toggle');
```

### .password('val', [value]);

Get the current value of the password or set the value of password.
```
$('#password).password('val'); // get value
$('#password).password('val', 'password'); // set value
```

## Events

The plugin exposes a few events.

<table>
    <thead>
        <tr>
            <th>Event Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>show.bs.password</td>
            <td>This event fires immediately when the show instance method is called. If caused by a click, the clicked element is available as the relatedTarget property of the event.</td>
        </tr>
        <tr>
            <td>hide.bs.password</td>
            <td>This event is fired immediately when the hide instance method has been called.</td>
        </tr>
    </tbody>
</table>

```
$('#password).on('show.bs.password', function (e) {
    // code here
});
```

## Reporting issues

Please provide jsFiddle when creating issues!

It's really saves much time. Use this as template:

[jsFiddle Bootstrap Show Password](http://jsfiddle.net/wenyi/L1ugpqk5/1/)

Your feedback is very appreciated!

## CHANGELOG

### 1.0.2

* Add `val` option.

### 1.0.1

* Via data attribute support.
* Rename file name to bootstrap-show-password.js
* Add bootstrap-show-password.min.js

### 1.0.0

* Initial release

## LICENSE

[The MIT License](https://github.com/wenzhixin/bootstrap-show-password/blob/master/LICENSE)
