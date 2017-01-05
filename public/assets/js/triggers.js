$(function () {
	//update buttons
	$('tbody').on('click', '.teal.button', function () {
		$this = $(this);
		$this.addClass('loading');
		var updatedTrigger = {
			_id: $this.parent().parent().parent().data('id'),
			guildId: $this.parent().parent().parent().find('input[name="guildId"]').val(),
			channelId: $this.parent().parent().parent().find('input[name="channelId"]').val(),
			userId: $this.parent().parent().parent().find('input[name="userId"]').val(),
			method: $this.parent().parent().parent().find('input[name="method"]').val(),
			text: $this.parent().parent().parent().find('input[name="text"]').val()
		};
		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(updatedTrigger),
			error: $.noop(),
			method: 'post',
			success: getAllTriggers,
			url: '/api/trigger/update'
		});
	});

	//delete buttons
	$('tbody').on('click', '.red.button', function () {
		$this = $(this);
		$this.addClass('loading');
		var deletedTrigger = {
			_id: $this.parent().parent().parent().data('id')
		};
		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(deletedTrigger),
			error: $.noop(),
			method: 'post',
			success: getAllTriggers,
			url: '/api/trigger/delete'
		});
	});

	//add buttons
	$('tbody').on('click', '.blue.button', function () {
		$this = $(this);
		$this.addClass('loading');
		var newTrigger = {
			guildId: $this.parent().parent().find('input[name="guildId"]').val(),
			channelId: $this.parent().parent().find('input[name="channelId"]').val(),
			userId: $this.parent().parent().find('input[name="userId"]').val(),
			method: $this.parent().parent().find('input[name="method"]').val(),
			text: $this.parent().parent().find('input[name="text"]').val()
		};
		$.ajax({
			contentType: 'application/json',
			data: JSON.stringify(newTrigger),
			error: $.noop(),
			method: 'post',
			success: getAllTriggers,
			url: '/api/trigger/add'
		});
	});

	getAllTriggers();
});

function getAllTriggers() {
	$.ajax({
		dataType: 'json',
		error: getAllTriggersError,
		method: 'get',
		success: getAllTriggersSuccess,
		url: '/api/trigger/all'
	});
}

function getAllTriggersError(jqHXR, textStatus, errorThrown) {
	//TODO
}

function getAllTriggersSuccess(data, textStatus, jqXHR) {
	//delete all current rows from table
	$('tbody').children().remove();

	//add rows with triggers to table
	for (var trigger of data) {
		$triggerRow = $([
			'<tr class="center aligned" data-id="' + trigger._id + '">',
			'	<td><div class="ui input"><input type="text" name="guildId" value="' + trigger.guildId + '"></div><!--<br>TODO--></td>',
			'	<td><div class="ui input"><input type="text" name="channelId" value="' + trigger.channelId + '"></div><!--<br>TODO--></td>',
			'	<td><div class="ui input"><input type="text" name="userId" value="' + trigger.userId + '"></div><!--<br>TODO--></td>',
			'	<td>',
			'		<div class="ui selection dropdown">',
			'			<input type="hidden" name="method" value="' + trigger.method + '">',
			'			<i class="dropdown icon"></i>',
			'			<div class="default text">Method</div>',
			'			<div class="menu">',
			'				<div class="item" data-value="exactly">Is Exactly</div>',
			'				<div class="item" data-value="contains">Contains</div>',
			'				<div class="item" data-value="regex">Matches Regex</div>',
			'			</div>',
			'		</div>',
			'	</td>',
			'	<td><div class="ui input"><input type="text" name="text" value="' + trigger.text + '"></div></td>',
			'	<td>',
			'		<div class="ui buttons">',
			'			<button class="ui teal button">Update</button>',
			'			<button class="ui red button">Delete</button>',
			'		</div>',
			'	</td>',
			'</tr>'
		].join('\n'));
		
		$('tbody').append($triggerRow);
	}

	//add last row to create new triggers to table
	$addTriggerRow = $([
		'<tr class="center aligned">',
		'	<td><div class="ui input"><input type="text" name="guildId"></div></td>',
		'	<td><div class="ui input"><input type="text" name="channelId"></div></td>',
		'	<td><div class="ui input"><input type="text" name="userId"></div></td>',
		'	<td>',
		'		<div class="ui selection dropdown">',
		'			<input type="hidden" name="method">',
		'			<i class="dropdown icon"></i>',
		'			<div class="default text">Method</div>',
		'			<div class="menu">',
		'				<div class="item" data-value="exactly">Is Exactly</div>',
		'				<div class="item" data-value="contains">Contains</div>',
		'				<div class="item" data-value="regex">Matches Regex</div>',
		'			</div>',
		'		</div>',
		'	</td>',
		'	<td><div class="ui input"><input type="text" name="text"></div></td>',
		'	<td><button class="ui fluid blue button">Add</button></td>',
		'</tr>'
	].join('\n'));
	
	$('tbody').append($addTriggerRow);

	$('.ui.dropdown').dropdown();
}
