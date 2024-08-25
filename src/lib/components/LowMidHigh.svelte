<script lang="ts">
	export let legend: string;
	export let tooltip: string;
	const idPrefix = legend.replaceAll(' ', '-').toLowerCase();
</script>

<fieldset>
	<legend>{legend}</legend>

	<div>
		<input type="radio" id="{idPrefix}-none" name={idPrefix} value="none" checked />
		<label for="{idPrefix}-none">None</label>
	</div>

	<div>
		<input type="radio" id="{idPrefix}-low" name={idPrefix} value="low" />
		<label for="{idPrefix}-low">Low</label>
	</div>

	<div>
		<input type="radio" id="{idPrefix}-med" name={idPrefix} value="mid" />
		<label for="{idPrefix}-med">Mid</label>
	</div>

	<div>
		<input type="radio" id="{idPrefix}-high" name={idPrefix} value="high" />
		<label for="{idPrefix}-high">High</label>
	</div>

	<div class="tooltip">
		?
		<span class="tooltiptext">{tooltip}</span>
	</div>
</fieldset>

<style>
	fieldset {
		position: relative;
	}

	.tooltip {
		position: absolute;
		text-align: right;
		right: 0.2rem;
		bottom: 0.15rem;
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		width: 10rem;
		background-color: black;
		color: #fff;
		text-align: center;
		padding: 0.5rem 0;
		border-radius: 6px;
		top: -5px;
		right: 1rem;
		position: absolute;
		z-index: 1;
	}

	.tooltip:hover {
		cursor: help;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}

	.tooltip .tooltiptext::after {
		content: ' ';
		position: absolute;
		top: 9%;
		left: 100%; /* To the right of the tooltip */
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent transparent black;
	}
</style>
